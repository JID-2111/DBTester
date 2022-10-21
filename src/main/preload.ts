import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ExecutionModelType } from '../db/models/ExecutionModel';
import {
  ConnectionInputType,
  ConnectionModelType,
} from '../db/models/ConnectionModels';

const log = require('electron-log');

window.log = log.functions;

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

contextBridge.exposeInMainWorld('util', {
  ipcRenderer: {
    parse: (connection: ConnectionModelType) =>
      ipcRenderer.invoke('util:parse', connection),
  },
});

contextBridge.exposeInMainWorld('procedures', {
  ipcRenderer: {
    fetchProcedures: () => ipcRenderer.invoke('procedures:listProcedures'),
    fetchDatabases: () => ipcRenderer.invoke('procedures:listDatabases'),
    fetchTables: () => ipcRenderer.invoke('procedures:getTables'),
    fetchContent: (procedure: string) =>
      ipcRenderer.invoke('procedures:getProcedure', procedure),
    fetchColumns: (table: string) =>
      ipcRenderer.invoke('procedures:getColumns', table),
  },
});

contextBridge.exposeInMainWorld('connections', {
  ipcRenderer: {
    fetch: () => ipcRenderer.invoke('connections:fetch'),
    create: (model: ConnectionInputType) =>
      ipcRenderer.invoke('connections:create', model),
    select: (id: number) => ipcRenderer.invoke('connections:select', id),
    delete: (id: number) => ipcRenderer.invoke('connections:delete', id),
    disconnect: () => ipcRenderer.invoke('connections:disconnect'),
    update: (model: ConnectionModelType) =>
      ipcRenderer.invoke('connections:update', model),
    switch: (database: string) =>
      ipcRenderer.invoke('connections:switch', database),
    verify: () => ipcRenderer.invoke('connections:verify'),
  },
});

contextBridge.exposeInMainWorld('executions', {
  ipcRenderer: {
    checkPassFail: (test: ExecutionModelType) =>
      ipcRenderer.invoke('executions:checkPassFail', test),
  },
});
