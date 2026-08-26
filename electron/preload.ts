import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('resumeOS', {
  ping: () => ipcRenderer.invoke('ping'),
});
