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
    ddragon: (champs) => ipcRenderer.invoke('art:ddragon', champs),
    onDdragon: (cb) => ipcRenderer.on('art:ddragon-progress', (_e, d) => cb(d)),
    fandom: (wanted) => ipcRenderer.invoke('art:fandom', wanted),
    onFandom: (cb) => ipcRenderer.on('art:fandom-progress', (_e, d) => cb(d)),
  },
  openMap: (url) => ipcRenderer.invoke('map:open', url),
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (patch) => ipcRenderer.invoke('settings:set', patch),
  },
});
