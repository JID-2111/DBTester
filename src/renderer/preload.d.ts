import { IConnectionStringParameters } from 'connection-string-parser';
import { DBColumn } from 'db/clients/PgClient';
import { ProcedureParameter } from 'db/Procedures';
import { LogFunctions } from 'electron-log';
import { Channels } from 'main/preload';
import { ExecutionModelType } from '../db/models/ExecutionModel';
import ConnectionEntity from '../db/entity/ConnectionEntity';
import {
  ConnectionInputType,
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
        fetchProcedures(databases: string[]): Promise<Map<string, string[]>>;
        fetchDatabases(): Promise<string[]>;
        fetchTables(): Promise<string[]>;
        getProcedureParameters(
          procedure: string
        ): Promise<ProcedureParameter[]>;
        fetchContent(procedure: string): Promise<string>;
        fetchColumns(table: string): Promise<DBColumn[]>;
        createTestData(file: string, table: string): Promise<void>;
      };
    };
    connections: {
      ipcRenderer: {
        fetch(): Promise<ConnectionModelType[]>;
        create(model: ConnectionInputType): Promise<ConnectionModelType>;
        select(id: number): Promise<ConnectionEntity>;
        update(model: ConnectionModelType): Promise<void>;
        delete(id: number): Promise<void>;
        disconnect(): Promise<void>;
        switch(database: string): Promise<boolean>;
        preload(): Promise<boolean>;
        verify(): Promise<boolean>;
      };
    };
    executions: {
      ipcRenderer: {
        checkPassFail(test: ExecutionModelType): Promise<ExecutionModelType>;
        fetchAll(): Promise<ExecutionModelType[]>;
        fetchMostRecent(): Promise<ExecutionModelType>;
        delete(id: number): Promise<void>;
      };
    };
  }
}

export {};
