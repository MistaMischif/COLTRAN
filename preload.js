const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studioApi', {
  buildAndPreview: () => ipcRenderer.invoke('build-and-preview'),
  openPreview: () => ipcRenderer.invoke('open-preview')
});
