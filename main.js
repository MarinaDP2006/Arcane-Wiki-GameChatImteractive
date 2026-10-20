// Proceso principal de Electron: ventana, guardado de partidas y chat IA opcional.
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
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
// La jugadora puede poner aquí sus propias imágenes y vídeos; el juego los usa
// en lugar del arte pintado que genera. No se distribuye nada con el juego.
const ART_DIRS = ['personajes', 'escenas', 'codice', 'video'];
const ART_EXT = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;
const artRoot = () => path.join(app.getPath('userData'), 'arte');

function ensureArtDir() {
  for (const d of ART_DIRS) fs.mkdirSync(path.join(artRoot(), d), { recursive: true });
  const readme = path.join(artRoot(), 'LEEME.txt');
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(readme, [
      'Carpeta de arte personal de Arcane: Piltover y Zaun',
      '',
      'Pon aquí tus imágenes (png, jpg, webp) y vídeos (mp4, webm). El nombre del archivo',
      'debe ser el identificador de lo que sustituye:',
      '',
      '  personajes/vi.png, personajes/jinx.jpg ...  -> retratos de personajes',
      '  escenas/ultima-gota.jpg, escenas/piltover.jpg ... -> fondos de escenas y del menú',
      '  codice/hextec.png ...                        -> imágenes del Códice',
      '  video/intro-zaun.mp4, video/intro-piltover.mp4, video/fin-paz.mp4 ... -> cinemáticas',
      '',
      'Identificadores: los de la lista del Códice (vi, jinx, caitlyn, jayce, viktor, mel, silco,',
      'vander, ekko, piltover, zaun, puente, academia, consejo, callejones, arbol, ...).',
      'Reinicia el juego tras añadir archivos.',
    ].join('\n'));
  }
}

ipcMain.handle('art:list', () => {
  ensureArtDir();
  const out = {};
  for (const d of ART_DIRS) {
    out[d] = {};
    for (const f of fs.readdirSync(path.join(artRoot(), d))) {
      if (!ART_EXT.test(f)) continue;
      out[d][f.replace(/\.[^.]+$/, '').toLowerCase()] = pathToFileURL(path.join(artRoot(), d, f)).href;
    }
  }
  return out;
});
ipcMain.handle('art:open', () => {
  ensureArtDir();
  return shell.openPath(artRoot());
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
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
