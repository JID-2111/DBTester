import { Channels } from 'main/preload';
import { ConnectionModel } from '../db/Models';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    procedures: {
      ipcRenderer: {
        fetchProcedures(): Promise<Map<string, string[]>>;
        fetchDatabases(): Promise<string[]>;
        fetchContent(procedure: string): Promise<string>;
      };
    };
    connections: {
      ipcRenderer: {
        fetch(): Promise<ConnectionModel[]>;
        create(model: ConnectionModel): Promise<ConnectionModel>;
        select(id: number): null;
        delete(id: number): Promise<null>;
      };
    };
  }
}

export {};
