import { ipcMain } from 'electron';
import ExecutionService from '../db/service/ExecutionService';
import Procedures from '../db/Procedures';
import ConnectionService from '../db/service/ConnectionService';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('procedures:listProcedures', () => {
  return new Procedures().getProceduresForDB(['React']);
});

ipcMain.handle('procedures:listDatabases', () => {
  return new Procedures().getDatabases();
});

ipcMain.handle('procedures:getProcedure', async (_event, ...args) => {
  return new Procedures().fetchContent(args[0]);
});

ipcMain.handle('procedures:getProcedureParameters', async (_event, ...args) => {
  return new Procedures().getProcedureParameters(args[0]);
});

ipcMain.handle('procedures:getColumns', async (_event, ...args) => {
  return new Procedures().fetchColumns(args[0]);
});

ipcMain.handle('procedures:createTestData', async (_event, ...args) => {
  return new Procedures().createTestData(args[0], args[1]);
});

ipcMain.handle('procedures:getTables', () => {
  return new Procedures().fetchTables();
});

ipcMain.handle('connections:fetch', () => {
  return new ConnectionService().fetch();
});

ipcMain.handle('connections:create', (_event, ...args) => {
  return new ConnectionService().create(args[0]);
});

ipcMain.handle('connections:select', (_event, ...args) => {
  return new ConnectionService().select(args[0]);
});

ipcMain.handle('connections:delete', (_event, ...args) => {
  return new ConnectionService().delete(args[0]);
});

ipcMain.handle('connections:disconnect', (_event) => {
  return new ConnectionService().disconnect();
});

ipcMain.handle('connections:update', (_event, ...args) => {
  return new ConnectionService().update(args[0]);
});

ipcMain.handle('connections:switch', (_event, ...args) => {
  return new ConnectionService().switch(args[0]);
});

ipcMain.handle('connections:verify', (_event) => {
  return new ConnectionService().verify();
});

ipcMain.handle('executions:fetchAll', (_event) => {
  return new ExecutionService().fetch();
});

ipcMain.handle('executions:fetchMostRecent', (_event) => {
  return new ExecutionService().getMostRecent();
});

ipcMain.handle('executions:checkPassFail', (_event, ...args) => {
  return new ExecutionService().checkPassFail(args[0]);
});
