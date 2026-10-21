// Proceso principal de Electron: ventana, guardado de partidas y ajustes.
const { app, BrowserWindow, ipcMain, shell, dialog, nativeImage, session } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// La app se llama «Arcane», pero las partidas, ajustes y arte siguen en la carpeta de siempre
// (%APPDATA%\Arcane Piltover y Zaun), así no se pierde nada al actualizar.
app.setPath('userData', path.join(app.getPath('appData'), 'Arcane Piltover y Zaun'));

const SAVE_DIR = () => path.join(app.getPath('userData'), 'partidas');
const SETTINGS_FILE = () => path.join(app.getPath('userData'), 'ajustes.json');
const SLOTS = ['1', '2', '3'];

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function slotFile(slot) {
  if (!SLOTS.includes(String(slot))) throw new Error('Ranura no válida');
  return path.join(SAVE_DIR(), `ranura-${slot}.json`);
}

// Las páginas del mapa del Códice se piden en español cuando la web lo permite.
function setupMapSession() {
  const ses = session.fromPartition('persist:mapa');
  ses.setUserAgent(`${ses.getUserAgent()} ArcanePiltoverZaun`);
  ses.webRequest.onBeforeSendHeaders((details, cb) => {
    details.requestHeaders['Accept-Language'] = 'es-ES,es;q=0.9';
    cb({ requestHeaders: details.requestHeaders });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#0d0b14',
    title: 'Arcane',
    show: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: true,
    },
  });
  // Las vistas web (mapa del Códice) se cargan aisladas y sin acceso al juego.
  win.webContents.on('will-attach-webview', (_e, prefs, params) => {
    delete prefs.preload;
    prefs.nodeIntegration = false;
    prefs.contextIsolation = true;
    prefs.sandbox = true;
    if (!/^https:\/\//.test(params.src)) _e.preventDefault();
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', () => {
    win.maximize();
    win.show();
  });
  // F11 alterna pantalla completa, como en cualquier juego de escritorio.
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    }
  });
  // Los enlaces externos se abren en el navegador, nunca dentro de la app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ---------- Carpeta de arte personal ----------
// La jugadora puede poner aquí sus propias imágenes; el juego los usa
// en lugar del arte pintado que genera. No se distribuye nada con el juego.
// «escenas» es el nombre antiguo de «lugares» y se sigue leyendo.
const ART_DIRS = ['avatares', 'personajes', 'caras', 'lugares', 'codice'];
const ART_EXT = /\.(png|jpe?g|webp|gif)$/i;
const artRoot = () => path.join(app.getPath('userData'), 'arte');

function ensureArtDir() {
  for (const d of ART_DIRS) fs.mkdirSync(path.join(artRoot(), d), { recursive: true });
}

// Otros nombres con los que la jugadora guarda las caras de los personajes.
const ART_ALIASES = { ambressa: 'ambessa', kiraman: 'cassandra', kiramman: 'cassandra', 'cassandra-kiramman': 'cassandra', powder: 'jinx', violet: 'vi',
  heirmendinger: 'heimerdinger', heimendinger: 'heimerdinger', heimer: 'heimerdinger' };

function listDir(dir) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    if (!ART_EXT.test(f)) continue;
    const name = f.replace(/\.[^.]+$/, '').toLowerCase();
    out[ART_ALIASES[name] || name] = pathToFileURL(path.join(dir, f)).href;
  }
  return out;
}

// Carpeta «arte» junto al ejecutable (o al .exe portátil): también se lee, para quien guarda
// ahí sus vídeos e imágenes. La carpeta de arte de AppData manda sobre ella.
// También se busca una carpeta «arte» en Documentos (hasta dos niveles), p. ej.
// Documentos\LOL-Game_Arcane\Arcane Piltover y Zaun\arte, donde mucha gente guarda sus vídeos.
function documentsRoots() {
  const out = [];
  let docs;
  try { docs = app.getPath('documents'); } catch { return out; }
  const subdirs = (d) => { try { return fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => path.join(d, e.name)); } catch { return []; } };
  const level1 = subdirs(docs);
  for (const d of [docs, ...level1, ...level1.flatMap(subdirs)]) {
    const arte = path.join(d, 'arte');
    if (fs.existsSync(arte)) out.push(arte);
  }
  return out;
}

const besideRoots = () => [...new Set([process.env.PORTABLE_EXECUTABLE_DIR, path.dirname(process.execPath)].filter(Boolean).map((d) => path.join(d, 'arte')).concat(documentsRoots()))]
  .filter((d) => d !== artRoot() && fs.existsSync(d));

const listArt = (root, d) => listDir(path.join(root, d));

// Arte incluido con el juego (src/img/arte); lo que pongas en tu carpeta de arte lo sustituye.
const bundledRoot = () => path.join(__dirname, 'src', 'img', 'arte');

// Las versiones anteriores podían bajar retratos de Riot (Data Dragon). Ahora todo sale de la
// Arcane Wiki, así que esos archivos se apartan a «_riot-retirado» (no se borran). Se reconocen
// por su tamaño: cuerpo 308×560 (loading), ilustración 1215×717 (splash) y cara 256×256 recortada.
function retireRiotArt() {
  const size = (f) => { try { return nativeImage.createFromPath(f).getSize(); } catch { return {}; } };
  const is = (f, w, h) => { const s = size(f); return s.width === w && s.height === h; };
  const move = (dir, file) => {
    const to = path.join(artRoot(), '_riot-retirado', dir);
    fs.mkdirSync(to, { recursive: true });
    try { fs.renameSync(path.join(artRoot(), dir, file), path.join(to, file)); } catch { /* en uso */ }
  };
  const bodies = path.join(artRoot(), 'personajes');
  if (!fs.existsSync(bodies)) return;
  for (const f of fs.readdirSync(bodies)) {
    if (!/\.jpg$/i.test(f) || !is(path.join(bodies, f), 308, 560)) continue;
    const id = f.replace(/\.jpg$/i, '');
    const when = fs.statSync(path.join(bodies, f)).mtimeMs;
    move('personajes', f);
    if (is(path.join(artRoot(), 'codice', `${id}.jpg`), 1215, 717)) move('codice', `${id}.jpg`);
    const face = path.join(artRoot(), 'caras', `${id}.png`);
    if (fs.existsSync(face) && is(face, 256, 256) && Math.abs(fs.statSync(face).mtimeMs - when) < 60000) move('caras', `${id}.png`);
  }
}

ipcMain.handle('art:list', () => {
  ensureArtDir();
  retireRiotArt();
  const out = {};
  const roots = besideRoots();
  for (const d of ART_DIRS) {
    out[d] = Object.assign({}, listArt(bundledRoot(), d), ...roots.map((r) => listArt(r, d)), listArt(artRoot(), d));
  }
  out.lugares = { ...listDir(path.join(artRoot(), 'escenas')), ...out.lugares };
  return out;
});
ipcMain.handle('art:open', (_e, sub) => {
  ensureArtDir();
  return shell.openPath(sub && ART_DIRS.includes(sub) ? path.join(artRoot(), sub) : artRoot());
});
// La interfaz genera la guía con todos los nombres de archivo que el juego reconoce.
ipcMain.handle('art:guide', (_e, text) => {
  ensureArtDir();
  fs.writeFileSync(path.join(artRoot(), 'GUIA-DE-ARTE.txt'), String(text), 'utf8');
  return true;
});

// Recorta la cara (parte alta y centrada) de un retrato y la guarda en caras/<id>.png.
function saveFace(file, id) {
  const body = nativeImage.createFromPath(file);
  const { width, height } = body.getSize();
  if (!width || !height) return false;
  const side = Math.round(Math.min(width * 0.72, height * 0.9));
  const y = Math.min(Math.round(height * 0.07), height - side);
  const face = body.crop({ x: Math.round((width - side) / 2), y, width: side, height: side }).resize({ width: 256, height: 256, quality: 'best' });
  fs.writeFileSync(path.join(artRoot(), 'caras', `${id}.png`), face.toPNG());
  return true;
}

const hasArt = (dir, id) => fs.existsSync(path.join(bundledRoot(), dir)) && fs.readdirSync(path.join(bundledRoot(), dir)).some((f) => ART_EXT.test(f) && f.replace(/\.[^.]+$/, '').toLowerCase() === id)
  || fs.existsSync(path.join(artRoot(), dir)) && fs.readdirSync(path.join(artRoot(), dir)).some((f) => ART_EXT.test(f) && f.replace(/\.[^.]+$/, '').toLowerCase() === id);

// Imágenes de la Arcane Wiki (Fandom): la imagen principal de cada página, para los
// personajes y lugares que aún no tienen archivo. items: [{ id, dir, titles, search }]
const FANDOM = process.env.ARCANE_FANDOM || 'https://arcane.fandom.com';
const FANDOM_HEADERS = { 'User-Agent': 'ArcanePiltoverZaun/1.4 (juego de fans, uso personal)' };

async function fandomImage(params) {
  const q = new URLSearchParams({ action: 'query', format: 'json', redirects: '1', prop: 'pageimages', piprop: 'original', ...params });
  const res = await fetch(`${FANDOM}/api.php?${q}`, { headers: FANDOM_HEADERS });
  if (!res.ok) throw new Error(`${res.status}`);
  const pages = Object.values((await res.json()).query?.pages || {});
  return pages.find((p) => p.original?.source)?.original.source || null;
}

ipcMain.handle('art:fandom', async (e, items) => {
  ensureArtDir();
  const send = (d) => { if (!e.sender.isDestroyed()) e.sender.send('art:fandom-progress', d); };
  const done = [];
  const failed = [];
  const todo = items.filter((it) => ['personajes', 'lugares', 'codice'].includes(it.dir) && /^[a-z0-9-]+$/.test(it.id) && !hasArt(it.dir, it.id));
  for (let i = 0; i < todo.length; i++) {
    const it = todo[i];
    send({ current: it.titles[0] || it.id, progress: i / todo.length });
    try {
      let src = null;
      for (const t of it.titles) { src = await fandomImage({ titles: t }); if (src) break; }
      if (!src && it.search) src = await fandomImage({ generator: 'search', gsrsearch: it.search, gsrlimit: '1' });
      if (!src || !(/^https:\/\//.test(src) || src.startsWith(FANDOM))) throw new Error('sin imagen');
      const img = await fetch(src, { headers: FANDOM_HEADERS });
      if (!img.ok) throw new Error(`${img.status}`);
      const ext = (src.match(/\.(png|jpe?g|webp)(?:\/|\?|$)/i)?.[1] || 'jpg').toLowerCase().replace('jpeg', 'jpg');
      const file = path.join(artRoot(), it.dir, `${it.id}.${ext}`);
      fs.writeFileSync(file, Buffer.from(await img.arrayBuffer()));
      if (it.dir === 'personajes' && !hasArt('caras', it.id)) saveFace(file, it.id);
      done.push(it.id);
    } catch {
      failed.push(it.id);
    }
  }
  send({ done: true, progress: 1 });
  return { ok: true, done, failed, skipped: items.length - todo.length };
});

// ---------- Imágenes del mapa 3D (Universe de League of Legends) ----------
// Fondos panorámicos del mundo abierto: arte/mapa/piltover y arte/mapa/zaun. El botón de
// Ajustes (o la primera visita a cada ciudad) baja las ilustraciones de las páginas de
// región de universe.leagueoflegends.com; también puedes poner las tuyas en esas carpetas.
const REGIONS = ['piltover', 'zaun'];
const UNIVERSE_PAGE = { piltover: 'https://universe.leagueoflegends.com/en_US/region/piltover/', zaun: 'https://universe.leagueoflegends.com/en_PL/region/zaun/' };
const UNIVERSE_API = process.env.ARCANE_UNIVERSE || 'https://universe-meeps.leagueoflegends.com/v1';
const MAP_FALLBACK = { piltover: ['piltover', 'academia', 'consejo', 'taller-jayce', 'stillwater', 'hexpuertas'], zaun: ['zaun', 'ultima-gota', 'comuna-viktor'] };
const mapDir = (region) => path.join(artRoot(), 'mapa', region);

// Las imágenes viajan como data: URL para que WebGL pueda usarlas como textura.
function imageDataURL(file) {
  if (/\.(jpe?g|png)$/i.test(file)) {
    const img = nativeImage.createFromPath(file);
    const { width } = img.getSize();
    if (width > 2048) return img.resize({ width: 2048, quality: 'best' }).toDataURL();
  }
  const mime = /\.png$/i.test(file) ? 'png' : /\.webp$/i.test(file) ? 'webp' : 'jpeg';
  return `data:image/${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

ipcMain.handle('map:images', (_e, region) => {
  if (!REGIONS.includes(region)) return { images: [], own: false };
  const roots = [mapDir(region), ...besideRoots().map((r) => path.join(r, 'mapa', region)), path.join(bundledRoot(), 'mapa', region)];
  const files = roots.filter((d) => fs.existsSync(d)).flatMap((d) => fs.readdirSync(d).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort().map((f) => path.join(d, f)));
  const own = files.length > 0;
  if (!own) {
    for (const id of MAP_FALLBACK[region]) {
      const f = path.join(bundledRoot(), 'lugares', `${id}.webp`);
      if (fs.existsSync(f)) files.push(f);
    }
  }
  const images = [];
  for (const f of files.slice(0, 8)) { try { images.push(imageDataURL(f)); } catch { /* imagen dañada */ } }
  return { images, own };
});

// Busca todas las direcciones de imagen dentro de la respuesta de la web de Universe.
function collectImageURLs(value, out) {
  if (typeof value === 'string') {
    const v = value.startsWith('/v1/') ? `https://universe-meeps.leagueoflegends.com${value}` : value;
    if (/^https:\/\/[^\s"'<>]+\.(jpe?g|png|webp)(\?[^\s"'<>]*)?$/i.test(v)) out.add(v);
  } else if (Array.isArray(value)) value.forEach((v) => collectImageURLs(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectImageURLs(v, out));
  return out;
}

async function universeImageURLs(region) {
  const headers = { 'User-Agent': 'ArcanePiltoverZaun/1.8 (juego de fans, uso personal)' };
  const found = new Set();
  for (const loc of ['en_us', 'en_pl', 'es_es']) {
    try {
      const res = await fetch(`${UNIVERSE_API}/${loc}/factions/${region}/index.json`, { headers });
      if (res.ok) collectImageURLs(await res.json(), found);
    } catch { /* sin conexión con la API */ }
    if (found.size) break;
  }
  if (!found.size) {
    // Plan B: la propia página de la región
    const res = await fetch(UNIVERSE_PAGE[region], { headers });
    if (!res.ok) throw new Error(`${res.status}`);
    const html = await res.text();
    for (const m of html.matchAll(/https:\/\/[^\s"'<>()]+\.(?:jpe?g|png|webp)(?:\?[^\s"'<>()]*)?/gi)) found.add(m[0].replace(/&amp;/g, '&'));
  }
  // Primero el arte de la región; los iconos y escudos pequeños no sirven de fondo.
  const score = (u) => (/splash|faction|region|background|hero|landscape|map/i.test(u) ? 2 : 0) + (u.toLowerCase().includes(region) ? 1 : 0) - (/icon|crest|thumb|square|avatar|logo|sprite|emblem/i.test(u) ? 5 : 0);
  return [...found].filter((u) => score(u) > -5).sort((a, b) => score(b) - score(a));
}

ipcMain.handle('map:universe', async (_e, region) => {
  if (!REGIONS.includes(region)) return { ok: false, done: 0 };
  const dir = mapDir(region);
  fs.mkdirSync(dir, { recursive: true });
  const urls = await universeImageURLs(region);
  let done = 0;
  for (const url of urls) {
    if (done >= 8) break;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 40000) continue; // icono, no ilustración
      const ext = (url.match(/\.(png|jpe?g|webp)(?:\?|$)/i)?.[1] || 'jpg').toLowerCase().replace('jpeg', 'jpg');
      fs.writeFileSync(path.join(dir, `universe-${String(done + 1).padStart(2, '0')}.${ext}`), buf);
      done++;
    } catch { /* la siguiente */ }
  }
  return { ok: done > 0, done, found: urls.length };
});

// Mapa interactivo de la ciudad en una ventana del propio juego.
ipcMain.handle('map:open', (e, url) => {
  if (!/^https:\/\//.test(String(url))) return false;
  const parent = BrowserWindow.fromWebContents(e.sender);
  const win = new BrowserWindow({
    parent, width: 1280, height: 800, title: 'Mapa interactivo · Piltover y Zaun', autoHideMenuBar: true,
    backgroundColor: '#0d0b14', webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false, partition: 'persist:mapa' },
  });
  win.webContents.setWindowOpenHandler(({ url: u }) => { if (/^https:\/\//.test(u)) shell.openExternal(u); return { action: 'deny' }; });
  win.loadURL(url);
  return true;
});

// ---------- Ventana ----------
ipcMain.handle('app:quit', () => app.quit());
ipcMain.handle('app:fullscreen', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (win) win.setFullScreen(!win.isFullScreen());
});

// ---------- Partidas ----------
ipcMain.handle('save:list', () =>
  SLOTS.map((slot) => {
    const data = readJSON(slotFile(slot), null);
    return {
      slot,
      empty: !data,
      name: data?.player?.name ?? null,
      origin: data?.player?.origin ?? null,
      chapter: data?.progress?.chapterTitle ?? null,
      savedAt: data?.savedAt ?? null,
    };
  })
);
ipcMain.handle('save:load', (_e, slot) => readJSON(slotFile(slot), null));
ipcMain.handle('save:write', (_e, slot, data) => {
  writeJSON(slotFile(slot), { ...data, savedAt: new Date().toISOString() });
  return true;
});
ipcMain.handle('save:delete', (_e, slot) => {
  fs.rmSync(slotFile(slot), { force: true });
  return true;
});

// Exportar la ficha del personaje a un archivo JSON elegido por el usuario.
ipcMain.handle('sheet:export', async (_e, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Exportar ficha de personaje',
    defaultPath: `ficha-${(data?.name || 'personaje').replace(/[^\w-]+/g, '_')}.json`,
    filters: [{ name: 'Ficha JSON', extensions: ['json'] }],
  });
  if (canceled || !filePath) return false;
  writeJSON(filePath, data);
  return true;
});

// ---------- Ajustes ----------
// Ajustes que dejaron de usarse con el chat de IA (v1.5.0): se borran al guardar.
const OLD_AI_KEYS = ['apiKey', 'hasApiKey', 'aiEnabled', 'aiProvider', 'aiModel', 'ollamaUrl', 'ollamaModel'];

ipcMain.handle('settings:get', () => {
  const s = readJSON(SETTINGS_FILE(), {});
  OLD_AI_KEYS.forEach((k) => delete s[k]);
  return s;
});
ipcMain.handle('settings:set', (_e, patch) => {
  const next = { ...readJSON(SETTINGS_FILE(), {}), ...patch };
  OLD_AI_KEYS.forEach((k) => delete next[k]);
  writeJSON(SETTINGS_FILE(), next);
  return true;
});

// Las voces se retiraron en la v1.4.1: borra las que se descargaron con versiones anteriores.
function removeOldVoices() {
  fs.rm(path.join(app.getPath('userData'), 'voces'), { recursive: true, force: true }, () => {});
}

app.whenReady().then(() => {
  setupMapSession();
  removeOldVoices();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
