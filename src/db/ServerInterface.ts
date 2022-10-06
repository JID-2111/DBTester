import { Pool } from 'pg';
import { ConnectionModelType } from './models/ConnectionModels';
import { ProcedureParameter } from './Procedures';

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

  callProcedureQuery(
    procedure: string,
    parameters: string[]
  ): Promise<string[]>;
  // eslint-disable-next-line prettier/prettier, semi
}
