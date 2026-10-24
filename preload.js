// Puente seguro entre la interfaz y el proceso principal.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('umbral', {
  isDesktop: true,
  platform: process.platform,
  quit: () => ipcRenderer.invoke('app:quit'),
  toggleFullscreen: () => ipcRenderer.invoke('app:fullscreen'),
  saves: {
    list: () => ipcRenderer.invoke('save:list'),
    load: (slot) => ipcRenderer.invoke('save:load', slot),
    write: (slot, data) => ipcRenderer.invoke('save:write', slot, data),
    remove: (slot) => ipcRenderer.invoke('save:delete', slot),
    exportFile: (slot, file) => ipcRenderer.invoke('save:export', slot, file),
  },
  exportSheet: (data) => ipcRenderer.invoke('sheet:export', data),
  art: {
    list: () => ipcRenderer.invoke('art:list'),
    open: (sub) => ipcRenderer.invoke('art:open', sub),
    guide: (text) => ipcRenderer.invoke('art:guide', text),
    mapImages: (region) => ipcRenderer.invoke('map:images', region),
  },
  models: {
    list: () => ipcRenderer.invoke('model:list'),
    read: (name) => ipcRenderer.invoke('model:read', name),
    status: () => ipcRenderer.invoke('model:status'),
  },
  ai: (url, headers, body) => ipcRenderer.invoke('ai:chat', url, headers, body),
  aiGet: (url, headers) => ipcRenderer.invoke('ai:get', url, headers),
  lanIps: () => ipcRenderer.invoke('net:ips'),
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (patch) => ipcRenderer.invoke('settings:set', patch),
  },
});
