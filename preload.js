// Puente seguro entre la interfaz y el proceso principal.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('arcane', {
  isDesktop: true,
  platform: process.platform,
  quit: () => ipcRenderer.invoke('app:quit'),
  toggleFullscreen: () => ipcRenderer.invoke('app:fullscreen'),
  saves: {
    list: () => ipcRenderer.invoke('save:list'),
    load: (slot) => ipcRenderer.invoke('save:load', slot),
    write: (slot, data) => ipcRenderer.invoke('save:write', slot, data),
    remove: (slot) => ipcRenderer.invoke('save:delete', slot),
  },
  exportSheet: (data) => ipcRenderer.invoke('sheet:export', data),
  art: {
    list: () => ipcRenderer.invoke('art:list'),
    open: (sub) => ipcRenderer.invoke('art:open', sub),
    guide: (text) => ipcRenderer.invoke('art:guide', text),
    fandom: (wanted) => ipcRenderer.invoke('art:fandom', wanted),
    onFandom: (cb) => ipcRenderer.on('art:fandom-progress', (_e, d) => cb(d)),
    mapImages: (region) => ipcRenderer.invoke('map:images', region),
    universe: (region) => ipcRenderer.invoke('map:universe', region),
  },
  models: {
    list: () => ipcRenderer.invoke('model:list'),
    read: (name) => ipcRenderer.invoke('model:read', name),
  },
  openMap: (url) => ipcRenderer.invoke('map:open', url),
  ai: (url, headers, body) => ipcRenderer.invoke('ai:chat', url, headers, body),
  aiGet: (url) => ipcRenderer.invoke('ai:get', url),
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (patch) => ipcRenderer.invoke('settings:set', patch),
  },
});
