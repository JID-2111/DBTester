import { IConnectionStringParameters } from 'connection-string-parser';
import { DBColumn } from 'db/clients/PgClient';
import { LogFunctions } from 'electron-log';
import { Channels } from 'main/preload';
import ConnectionEntity from '../db/entity/ConnectionEntity';
import {
  ConnectionInputType,
  ConnectionModel,
  ConnectionModelType,
} from '../db/models/ConnectionModels';

declare global {
  interface Window {
    log: LogFunctions;
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
    util: {
      ipcRenderer: {
        parse(
          connection: ConnectionModelType
        ): Promise<IConnectionStringParameters | null>;
      };
    };
    procedures: {
      ipcRenderer: {
        fetchProcedures(): Promise<Map<string, string[]>>;
        fetchDatabases(): Promise<string[]>;
        fetchContent(procedure: string): Promise<string>;
        fetchColumns(table: string): Promise<DBColumn[]>;
      };
    };
    connections: {
      ipcRenderer: {
        fetch(): Promise<ConnectionModel[]>;
        create(model: ConnectionInputType): Promise<ConnectionModel>;
        select(id: number): Promise<ConnectionEntity>;
        update(model: ConnectionModelType): Promise<void>;
        delete(id: number): Promise<void>;
        disconnect(): Promise<void>;
        switch(database: string): Promise<boolean>;
        preload(): Promise<boolean>;
        verify(): Promise<boolean>;
      };
    };
  }
}

export {};
