import { Pool } from 'pg';
import { ConnectionModelType } from '../models/ConnectionModels';
import { ProcedureParameter } from '../Procedures';
import { DBColumn } from './PgClient';

export default interface ServerInterface {
  pool: Pool;

  model: ConnectionModelType;

  verify(): Promise<boolean>;

  getDatabasesQuery(): Promise<unknown>;

  fetchProceduresQuery(): Promise<string[]>;

  fetchContentQuery(procedure: string): Promise<string[]>;

  fetchProcedureParametersQuery(
    procedure: string
  ): Promise<ProcedureParameter[]>;

  fetchColumnsQuery(tb_name: string): Promise<DBColumn[]>;

  fetchTablesQuery(): Promise<string[]>;

  callProcedureQuery(
    procedure: string,
    parameters: string[]
  ): Promise<string[]>;
  // eslint-disable-next-line prettier/prettier, semi
}
