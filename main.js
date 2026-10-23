// Proceso principal de Electron: ventana, guardado de partidas y ajustes.
const { app, BrowserWindow, ipcMain, shell, dialog, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');

// La app se llama «Grietas & Gears», pero las partidas, ajustes y arte siguen en la carpeta de siempre
// (%APPDATA%\Arcane Piltover y Zaun), así no se pierde nada al actualizar.
// GRIETAS_DATOS permite probar el juego con otra carpeta sin tocar las partidas reales.
app.setPath('userData', process.env.GRIETAS_DATOS || path.join(app.getPath('appData'), 'Rifts & Gears - Las ciudades del Umbral'));
const Modelos = require('./modelos');

const SAVE_DIR = () => path.join(app.getPath('userData'), 'partidas');
// Solo metadatos de las partidas. No se guardan decisiones, chats ni estadísticas aquí.
const SAVE_SUMMARY_DIR = () => path.join(app.getPath('userData'), 'historial', 'partidas-guardadas');
const SETTINGS_FILE = () => path.join(app.getPath('userData'), 'ajustes.json');
const SLOTS = ['1', '2', '3'];

/** Lee datos JSON del disco y devuelve un valor alternativo ante errores. */
function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

/** Crea carpetas y escribe datos JSON de forma legible. */
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

/** Valida la ranura y obtiene la ruta de una partida. */
function slotFile(slot) {
  if (!SLOTS.includes(String(slot))) throw new Error('Ranura no válida');
  return path.join(SAVE_DIR(), `ranura-${slot}.json`);
}

/** Crea la ventana segura de Electron y configura su comportamiento. */
function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#0d0b14',
    title: 'Las ciudades del Umbral',
    show: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
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
// Imágenes por temporada de Arcane: lugares/s1, lugares/s2, personajes/s1... (mandan sobre las generales).
const SEASON_DIRS = ['lugares', 'personajes', 'caras'].flatMap((d) => [`${d}/s1`, `${d}/s2`]);
const ART_EXT = /\.(png|jpe?g|webp|gif)$/i;
const artRoot = () => path.join(app.getPath('userData'), 'arte');

/** Prepara las carpetas de recursos visuales personales. */
function ensureArtDir() {
  for (const d of ART_DIRS) fs.mkdirSync(path.join(artRoot(), d), { recursive: true });
  fs.mkdirSync(path.join(artRoot(), 'modelos', 'animaciones'), { recursive: true });
}

// Otros nombres con los que la jugadora guarda las caras de los personajes.
const ART_ALIASES = { ambressa: 'ambessa', kiraman: 'cassandra', kiramman: 'cassandra', 'cassandra-kiramman': 'cassandra', powder: 'jinx', violet: 'vi',
  heirmendinger: 'heimerdinger', heimendinger: 'heimerdinger', heimer: 'heimerdinger' };

/** Enumera el contenido de una carpeta autorizada. */
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
  for (const d of [...ART_DIRS, ...SEASON_DIRS]) {
    out[d] = Object.assign({}, listArt(bundledRoot(), d), ...roots.map((r) => listArt(r, d)), listArt(artRoot(), d));
  }
  out.lugares = { ...listDir(path.join(artRoot(), 'escenas')), ...out.lugares };
  // Subcarpetas avatares/mujer y avatares/hombre: sus retratos salen solo con ese género.
  for (const g of ['mujer', 'hombre']) {
    for (const root of [...roots, artRoot()]) {
      for (const [n, url] of Object.entries(listArt(root, path.join('avatares', g)))) out.avatares[`${g}-${n}`] = url;
    }
  }
  return out;
});
ipcMain.handle('art:open', (_e, sub) => {
  ensureArtDir();
  return shell.openPath(sub && [...ART_DIRS, 'modelos'].includes(sub) ? path.join(artRoot(), sub) : artRoot());
});
// La interfaz genera la guía con todos los nombres de archivo que el juego reconoce.
ipcMain.handle('art:guide', (_e, text) => {
  ensureArtDir();
  fs.writeFileSync(path.join(artRoot(), 'GUIA-DE-ARTE.txt'), String(text), 'utf8');
  return true;
});

// ---------- Modelos 3D (.glb, .fbx o .zip) ----------
// Personajes en 3D para el mundo abierto (por ejemplo, de Mixamo o Sketchfab): modelos/<id>.glb,
// .fbx o .zip (con el .fbx y sus texturas dentro), modelos/jugador.*, modelos/generico.* y
// modelos/animaciones/{reposo,andar,correr}.*. El nombre vale aunque lleve más palabras
// («Vi_Arcane.zip» es Vi). También se miran las carpetas de personajes con «3d» en el nombre
// (personajes/3d models). Se leen de src/models (incluidos con el juego), de las carpetas «arte»
// de siempre y de la carpeta de arte de AppData, que manda sobre las demás.
const MODEL_IDS = ['vi', 'jinx', 'caitlyn', 'jayce', 'viktor', 'mel', 'heimerdinger', 'silco', 'vander', 'ekko', 'sevika', 'ambessa', 'cassandra', 'isha', 'maddie', 'kino', 'jugador', 'generico'];
const MODEL_ALIASES = { ...ART_ALIASES, cait: 'caitlyn', heimer: 'heimerdinger', player: 'jugador', generic: 'generico' };
const MODEL_EXT = /\.(glb|fbx|obj|zip)$/i;
// Carpeta persistente donde se guardan los modelos ya preparados (texturas reducidas).
const modelCache = () => path.join(artRoot(), 'modelos', '_cache');

/** Identifica un personaje a partir del nombre de su archivo de modelo. */
function modelName(base) {
  const n = base.replace(MODEL_EXT, '').toLowerCase();
  if (MODEL_IDS.includes(n)) return n;
  if (MODEL_ALIASES[n]) return MODEL_ALIASES[n];
  for (const w of n.split(/[^a-z0-9]+/)) {
    if (MODEL_IDS.includes(w)) return w;
    if (MODEL_ALIASES[w]) return MODEL_ALIASES[w];
  }
  return n;
}

// Primer modelo dentro de una carpeta (un .zip descomprimido: «vi_arcane/source/Vi.fbx»).
function findModel(dir, depth = 0) {
  let list;
  try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch { return null; }
  const f = list.find((e) => e.isFile() && /\.glb$/i.test(e.name)) || list.find((e) => e.isFile() && /\.fbx$/i.test(e.name)) || list.find((e) => e.isFile() && /\.obj$/i.test(e.name));
  if (f) return path.join(dir, f.name);
  if (depth > 3) return null;
  for (const e of list) if (e.isDirectory()) { const r = findModel(path.join(dir, e.name), depth + 1); if (r) return r; }
  return null;
}

/** Enumera los modelos tridimensionales disponibles. */
function modelFiles() {
  const out = {};
  const add = (name, file, root) => { out[name] = { file, root: root || path.dirname(file) }; };
  const walk = (dir, pre) => {
    let list;
    try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of list) {
      const full = path.join(dir, e.name);
      if (e.name === '_cache') continue; // copias preparadas, no son modelos nuevos
      if (e.isFile() && MODEL_EXT.test(e.name)) add(pre ? `${pre}${e.name.replace(MODEL_EXT, '').toLowerCase()}` : modelName(e.name), full);
      else if (e.isDirectory() && !pre && e.name.toLowerCase() === 'animaciones') walk(full, 'animaciones/');
      else if (e.isDirectory() && !pre) {
        const name = modelName(e.name);
        const m = MODEL_IDS.includes(name) ? findModel(full) : null;
        if (m && !out[name]) add(name, m, full);
        else if (!m) walk(full, '');
      }
    }
  };
  const roots = (r) => {
    walk(path.join(r, 'modelos'), '');
    let list = [];
    try { list = fs.readdirSync(path.join(r, 'personajes'), { withFileTypes: true }); } catch { /* sin carpeta */ }
    for (const e of list) if (e.isDirectory() && /3d/i.test(e.name)) walk(path.join(r, 'personajes', e.name), '');
  };
  walk(path.join(__dirname, 'src', 'models'), '');
  for (const r of besideRoots()) roots(r);
  roots(artRoot());
  return out;
}

const bytes = (buf) => new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

// Estado del último intento de cada modelo (para la pantalla de ajustes y los registros).
const modelStatus = {};

// Un .glb suelto se devuelve tal cual. Los ZIP, FBX y OBJ pasan antes por la caché de
// modelos (modelos.js): se abren una vez, se reducen sus texturas y se guardan preparados.
ipcMain.handle('model:list', () => Object.keys(modelFiles()));
ipcMain.handle('model:status', () => modelStatus);
ipcMain.handle('model:read', async (_e, name) => {
  const id = String(name);
  const m = modelFiles()[id];
  if (!m) return null;
  if (/\.glb$/i.test(m.file)) {
    modelStatus[id] = { ok: true, file: m.file, kind: 'glb' };
    return bytes(fs.readFileSync(m.file));
  }
  try {
    fs.mkdirSync(modelCache(), { recursive: true });
    const prep = await Modelos.prepare(id, m.file, m.root, modelCache(), nativeImage);
    if (prep.error) {
      modelStatus[id] = { ok: false, file: m.file, error: prep.error };
      console.warn(`Modelo ${id}: ${prep.error === 'blend' ? 'solo hay un archivo de Blender (.blend); expórtalo como .glb o .fbx' : 'no hay ningún .glb, .fbx ni .obj'}`);
      return null;
    }
    const out = Modelos.readPrepared(prep);
    modelStatus[id] = { ok: true, file: m.file, kind: out.kind, textures: Object.keys(out.textures || {}).length };
    out.data = bytes(out.data);
    for (const k of Object.keys(out.textures || {})) out.textures[k] = bytes(out.textures[k]);
    return out;
  } catch (err) {
    modelStatus[id] = { ok: false, file: m.file, error: String(err?.message || err) };
    console.warn(`Modelo ${id}:`, err);
    return null;
  }
});

// ---------- Imágenes del mapa 3D ----------
// Fondos panorámicos del mundo abierto: vienen dentro del juego (src/img/arte/mapa) y
// también puedes poner los tuyos en las carpetas mapa/piltover y mapa/zaun de tu carpeta de arte.
const REGIONS = ['piltover', 'zaun'];
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

// ---------- IA para los chats (opcional) ----------
// La petición sale desde aquí para no chocar con CORS (Ollama local, Gemini, Groq…).
ipcMain.handle('ai:chat', async (_e, url, headers, body) => {
  try {
    const u = new URL(String(url));
    if (!/^https?:$/.test(u.protocol)) return { error: 'Dirección no válida' };
    const res = await fetch(u, {
      method: 'POST',
      headers: { ...(headers || {}), 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
      signal: AbortSignal.timeout(90000),
    });
    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch { data = { error: text.slice(0, 300) }; }
    return { status: res.status, data };
  } catch (err) {
    return { error: aiNetError(err, 'La IA ha tardado demasiado en responder') };
  }
});

function aiNetError(err, slow) {
  const code = err?.cause?.code;
  if (code === 'ECONNREFUSED') return 'No hay nada escuchando en esa dirección (¿está abierto Ollama o el servidor de LM Studio?)';
  if (code === 'EHOSTUNREACH' || code === 'ENETUNREACH' || code === 'UND_ERR_CONNECT_TIMEOUT') return 'No se llega a ese ordenador: revisa la IP y que estéis en la misma red wifi';
  if (err?.name === 'TimeoutError') return slow;
  return String(err?.message || err);
}

// Lista de modelos de Ollama o LM Studio: solo servidores de este ordenador o de la red de casa.
const LAN_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|[\w-]+\.local)$/i;
ipcMain.handle('ai:get', async (_e, url) => {
  try {
    const u = new URL(String(url));
    if (!LAN_HOST.test(u.hostname)) return { error: 'Solo se pueden mirar servidores de este ordenador o de tu red de casa' };
    const res = await fetch(u, { signal: AbortSignal.timeout(8000) });
    return { status: res.status, data: await res.json() };
  } catch (err) {
    return { error: aiNetError(err, 'El servidor no contesta') };
  }
});

// IP de este PC en la red de casa, para escribirla en la tablet (LM Studio en red local).
ipcMain.handle('net:ips', () => Object.values(os.networkInterfaces()).flat()
  .filter((n) => n && n.family === 'IPv4' && !n.internal && LAN_HOST.test(n.address)).map((n) => n.address));

// ---------- Ventana ----------
ipcMain.handle('app:quit', () => app.quit());
ipcMain.handle('app:fullscreen', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (win) win.setFullScreen(!win.isFullScreen());
});

// ---------- Partidas ----------
/** Lee la ranura y recupera la última copia de seguridad si el archivo principal está dañado. */
function readSave(slot) {
  const file = slotFile(slot);
  return readJSON(file, null) || readJSON(file + '.bak', null);
}

/** Guarda una partida de forma atómica y conserva su versión anterior como copia .bak. */
function writeSave(slot, data) {
  const file = slotFile(slot);
  const tmp = file + '.' + process.pid + '.tmp';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  try {
    fs.writeFileSync(tmp, JSON.stringify({ ...data, savedAt: new Date().toISOString() }, null, 2), 'utf8');
    // Solo conserva copias válidas; una partida corrupta no reemplaza un respaldo correcto.
    if (readJSON(file, null) !== null) fs.copyFileSync(file, file + '.bak');
    fs.renameSync(tmp, file);
    const saved = readJSON(file, null);
    if (saved) writeJSON(path.join(SAVE_SUMMARY_DIR(), `ranura-${slot}.json`), {
      'Nombre personaje': saved.player?.name || '',
      'Fecha': saved.savedAt || '',
      'Tiempo de juego': saved.playTimeSeconds || 0,
      'Nivel en historia': saved.progress?.chapterTitle || saved.progress?.chapterId || '',
      'Ciudad': saved.player?.origin === 'zaun' ? 'Zaun' : saved.player?.origin === 'piltover' ? 'Piltover' : '',
    });
  } finally {
    if (fs.existsSync(tmp)) fs.rmSync(tmp, { force: true });
  }
}
ipcMain.handle('save:list', () =>
  SLOTS.map((slot) => {
    const data = readSave(slot);
    return {
      slot,
      empty: !data,
      name: data?.player?.name ?? null,
      origin: data?.player?.origin ?? null,
      chapter: data?.progress?.chapterTitle ?? null,
      savedAt: data?.savedAt ?? null,
      playTimeSeconds: data?.playTimeSeconds ?? 0,
    };
  })
);
ipcMain.handle('save:load', (_e, slot) => readSave(slot));
ipcMain.handle('save:write', (_e, slot, data) => {
  writeSave(slot, data);
  return true;
});
ipcMain.handle('save:delete', (_e, slot) => {
  fs.rmSync(slotFile(slot), { force: true });
  fs.rmSync(slotFile(slot) + '.bak', { force: true });
  fs.rmSync(path.join(SAVE_SUMMARY_DIR(), `ranura-${slot}.json`), { force: true });
  return true;
});

// Exportar una partida a un archivo para llevarla a otro dispositivo (tableta, otro PC).
// El archivo va donde elija el jugador; nunca sale de su ordenador por sí solo.
ipcMain.handle('save:export', async (_e, slot, file) => {
  if (!readSave(slot)) return false;
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Exportar partida',
    defaultPath: path.join(app.getPath('documents'), path.basename(String(file || 'partida.json'))),
    filters: [{ name: 'Partida de Grietas & Gears', extensions: ['json'] }],
  });
  if (canceled || !filePath) return false;
  writeJSON(filePath, { formato: 'grietas-partida', version: 1, exportadaEl: new Date().toISOString(), partida: readSave(slot) });
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
  removeOldVoices();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
