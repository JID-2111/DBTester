import { Pool } from 'pg';

export default interface ServerConnection {
  pool: Pool;

  getDatabasesQuery(): Promise<unknown>;

  fetchProceduresQuery(): Promise<string[]>;

  fetchContentQuery(procedure: string): Promise<string[]>;
}
