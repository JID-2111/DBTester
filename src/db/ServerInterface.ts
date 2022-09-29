import { Pool } from 'pg';
import { ProcedureParameter } from './Procedures';

export default interface ServerInterface {
  pool: Pool;

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
