// Proceso principal de Electron: ventana, guardado de partidas y chat IA opcional.
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

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

ipcMain.handle('ai:chat', async (_e, { system, messages }) => {
  const settings = readJSON(SETTINGS_FILE(), {});
  if (!settings.apiKey) return { ok: false, error: 'No hay clave de API configurada.' };
  const Anthropic = require('@anthropic-ai/sdk').default;
  try {
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
    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    return { ok: true, text };
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return { ok: false, error: 'Clave de API no válida.' };
    if (err instanceof Anthropic.RateLimitError) return { ok: false, error: 'Demasiadas peticiones; espera un momento.' };
    if (err instanceof Anthropic.APIConnectionError) return { ok: false, error: 'Sin conexión con la API.' };
    if (err instanceof Anthropic.APIError) return { ok: false, error: `Error de la API (${err.status}): ${err.message}` };
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
