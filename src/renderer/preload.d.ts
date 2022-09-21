import ConnectionEntity from 'db/entity/ConnectionEntity';
import { Channels } from 'main/preload';
import { ConnectionModel, ConnectionModelType } from '../db/Models';

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
        create(model: ConnectionModelType): Promise<ConnectionModel>;
        select(id: number): Promise<ConnectionEntity>;
        update(model: ConnectionModelType): Promise<void>;
      };
    };
  }
}

export {};
