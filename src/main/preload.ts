import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ConnectionModel } from '../db/Models';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

contextBridge.exposeInMainWorld('procedures', {
  ipcRenderer: {
    fetchProcedures: () => ipcRenderer.invoke('procedures:listProcedures'),
    fetchDatabases: () => ipcRenderer.invoke('procedures:listDatabases'),
    fetchContent: (procedure: string) =>
      ipcRenderer.invoke('procedures:getProcedure', procedure),
  },
});

contextBridge.exposeInMainWorld('connections', {
  ipcRenderer: {
    fetch: () => ipcRenderer.invoke('connections:fetch'),
    create: (model: ConnectionModel) =>
      ipcRenderer.invoke('connections:create', model),
    select: (id: number) => ipcRenderer.invoke('connections:select', id),
  },
});
