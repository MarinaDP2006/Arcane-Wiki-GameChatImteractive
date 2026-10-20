// Proceso principal de Electron: ventana, guardado de partidas y chat IA opcional.
const { app, BrowserWindow, ipcMain, shell, dialog, nativeImage, session } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

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

// El mapa de neta.art se pide en español.
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
    title: 'Arcane: Piltover y Zaun',
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
// La jugadora puede poner aquí sus propias imágenes y vídeos; el juego los usa
// en lugar del arte pintado que genera. No se distribuye nada con el juego.
// «escenas» es el nombre antiguo de «lugares» y se sigue leyendo.
const ART_DIRS = ['avatares', 'personajes', 'caras', 'lugares', 'codice', 'video'];
const ART_EXT = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;
const artRoot = () => path.join(app.getPath('userData'), 'arte');

function ensureArtDir() {
  for (const d of ART_DIRS) fs.mkdirSync(path.join(artRoot(), d), { recursive: true });
}

function listDir(dir) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    if (!ART_EXT.test(f)) continue;
    out[f.replace(/\.[^.]+$/, '').toLowerCase()] = pathToFileURL(path.join(dir, f)).href;
  }
  return out;
}

ipcMain.handle('art:list', () => {
  ensureArtDir();
  const out = {};
  for (const d of ART_DIRS) out[d] = listDir(path.join(artRoot(), d));
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

// Retratos oficiales de League of Legends desde Data Dragon, el servidor público de Riot.
// Se guardan solo en el ordenador de la jugadora (política de proyectos de fans de Riot).
// ARCANE_DDRAGON solo sirve para pruebas automáticas con un servidor local.
const DDRAGON = process.env.ARCANE_DDRAGON || 'https://ddragon.leagueoflegends.com';
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

const hasArt = (dir, id) => fs.existsSync(path.join(artRoot(), dir)) && fs.readdirSync(path.join(artRoot(), dir)).some((f) => ART_EXT.test(f) && f.replace(/\.[^.]+$/, '').toLowerCase() === id);

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

ipcMain.handle('art:ddragon', async (e, champs) => {
  ensureArtDir();
  const send = (d) => { if (!e.sender.isDestroyed()) e.sender.send('art:ddragon-progress', d); };
  const versions = await (await fetch(`${DDRAGON}/api/versions.json`)).json();
  const v = versions[0];
  const done = [];
  const failed = [];
  const entries = Object.entries(champs);
  for (let i = 0; i < entries.length; i++) {
    const [id, champ] = entries[i];
    send({ current: champ, progress: i / entries.length });
    try {
      // Si el campeón tiene una apariencia de Arcane, se usa esa.
      const info = await (await fetch(`${DDRAGON}/cdn/${v}/data/es_ES/champion/${champ}.json`)).json();
      const skins = info.data[champ].skins || [];
      const arcane = skins.find((s) => /arcane/i.test(s.name));
      const num = arcane ? arcane.num : 0;
      // Cuerpo entero (personajes), ilustración grande (codice) y cara recortada (caras).
      for (const [kind, dir] of [['loading', 'personajes'], ['splash', 'codice']]) {
        const res = await fetch(`${DDRAGON}/cdn/img/champion/${kind}/${champ}_${num}.jpg`);
        if (!res.ok) throw new Error(`${res.status}`);
        fs.writeFileSync(path.join(artRoot(), dir, `${id}.jpg`), Buffer.from(await res.arrayBuffer()));
      }
      saveFace(path.join(artRoot(), 'personajes', `${id}.jpg`), id);
      done.push(id);
    } catch {
      failed.push(id);
    }
  }
  send({ done: true, progress: 1 });
  return { ok: true, done, failed, version: v };
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
ipcMain.handle('settings:get', () => {
  const s = readJSON(SETTINGS_FILE(), {});
  // La clave nunca vuelve al renderer: solo se indica si existe.
  return { ...s, apiKey: undefined, hasApiKey: Boolean(s.apiKey) };
});
ipcMain.handle('settings:set', (_e, patch) => {
  const s = readJSON(SETTINGS_FILE(), {});
  const next = { ...s, ...patch };
  if (patch.apiKey === '') delete next.apiKey;
  delete next.hasApiKey;
  writeJSON(SETTINGS_FILE(), next);
  return true;
});

// ---------- Chat IA opcional (Claude) ----------
let anthropicClient = null;
let clientKey = null;

function getClient(apiKey) {
  if (!anthropicClient || clientKey !== apiKey) {
    const Anthropic = require('@anthropic-ai/sdk').default;
    anthropicClient = new Anthropic({ apiKey });
    clientKey = apiKey;
  }
  return anthropicClient;
}

// Las voces se retiraron en la v1.4.1: borra las que se descargaron con versiones anteriores.
function removeOldVoices() {
  fs.rm(path.join(app.getPath('userData'), 'voces'), { recursive: true, force: true }, () => {});
}

// ---------- Chat con IA: Ollama (local, por defecto) o Claude (opcional) ----------
const OLLAMA_DEFAULT = 'http://127.0.0.1:11434';
// Modelos de chat preferidos, por orden, si hay varios instalados.
const OLLAMA_PREFERRED = ['llama3', 'llama', 'qwen', 'mistral', 'gemma', 'phi', 'deepseek', 'command-r', 'openchat', 'neural-chat', 'vicuna'];
const isEmbedding = (m) => /embed|bge|minilm|nomic/i.test(m.name) || /bert/i.test(m.details?.family || '');

async function ollamaFetch(base, pathName, body, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${base.replace(/\/+$/, '')}${pathName}`, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Ollama respondió ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Lista los modelos de chat instalados en Ollama y elige uno.
async function ollamaModels(base) {
  const data = await ollamaFetch(base, '/api/tags', null, 4000);
  const models = (data.models || []).filter((m) => !isEmbedding(m)).map((m) => ({
    name: m.name,
    size: m.size,
    family: m.details?.family || '',
    params: m.details?.parameter_size || '',
  }));
  return models;
}

function pickOllamaModel(models, wanted) {
  if (wanted && models.some((m) => m.name === wanted)) return wanted;
  for (const pref of OLLAMA_PREFERRED) {
    const m = models.find((x) => x.name.toLowerCase().startsWith(pref));
    if (m) return m.name;
  }
  return models[0]?.name || null;
}

ipcMain.handle('ai:ollama-models', async (_e, url) => {
  const settings = readJSON(SETTINGS_FILE(), {});
  const base = url || settings.ollamaUrl || OLLAMA_DEFAULT;
  try {
    const models = await ollamaModels(base);
    const chosen = pickOllamaModel(models, settings.ollamaModel);
    return { ok: true, models, chosen, url: base };
  } catch (err) {
    return { ok: false, error: err.name === 'AbortError' ? 'Ollama no responde.' : `No se pudo conectar con Ollama (${err.message}).`, url: base };
  }
});

async function chatOllama(settings, system, messages) {
  const base = settings.ollamaUrl || OLLAMA_DEFAULT;
  let model = settings.ollamaModel;
  if (!model) {
    model = pickOllamaModel(await ollamaModels(base));
    if (!model) return { ok: false, error: 'Ollama no tiene ningún modelo de chat instalado. Prueba: ollama pull llama3.2' };
  }
  const data = await ollamaFetch(base, '/api/chat', {
    model,
    stream: false,
    messages: [{ role: 'system', content: system }, ...messages],
    options: { temperature: 0.8, num_predict: 400 },
  }, 180000);
  // Algunos modelos (qwen3, deepseek-r1…) incluyen su razonamiento entre etiquetas <think>.
  const text = String(data.message?.content || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  return text ? { ok: true, text, model } : { ok: false, error: 'El modelo no ha respondido nada.' };
}

async function chatClaude(settings, system, messages) {
  if (!settings.apiKey) return { ok: false, error: 'No hay clave de API configurada.' };
  const response = await getClient(settings.apiKey).beta.messages.create({
    model: settings.aiModel || 'claude-opus-5-5',
    max_tokens: 2048,
    output_config: { effort: 'low' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system,
    messages,
  });
  if (response.stop_reason === 'refusal') {
    return { ok: false, error: 'El personaje se queda en silencio… (la IA rechazó responder).' };
  }
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
  return { ok: true, text };
}

ipcMain.handle('ai:chat', async (_e, { system, messages }) => {
  const settings = readJSON(SETTINGS_FILE(), {});
  const provider = settings.aiProvider || 'ollama';
  try {
    return provider === 'claude' ? await chatClaude(settings, system, messages) : await chatOllama(settings, system, messages);
  } catch (err) {
    if (provider === 'claude') {
      const Anthropic = require('@anthropic-ai/sdk').default;
      if (err instanceof Anthropic.AuthenticationError) return { ok: false, error: 'Clave de API no válida.' };
      if (err instanceof Anthropic.RateLimitError) return { ok: false, error: 'Demasiadas peticiones; espera un momento.' };
      if (err instanceof Anthropic.APIConnectionError) return { ok: false, error: 'Sin conexión con la API.' };
      if (err instanceof Anthropic.APIError) return { ok: false, error: `Error de la API (${err.status}): ${err.message}` };
    }
    if (err.name === 'AbortError') return { ok: false, error: 'Ollama ha tardado demasiado en responder.' };
    if (/fetch failed|ECONNREFUSED/i.test(String(err.message))) return { ok: false, error: 'Ollama no está abierto. Inícialo y vuelve a intentarlo.' };
    return { ok: false, error: String(err?.message || err) };
  }
});

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
