import { Pool } from 'pg';
import log from 'electron-log';
import { ConnectionModelType } from './Models';
import ServerConnectionInterface from './ServerConnection';

type DBQuery = {
  datname: string;
};

type DBProcedure = {
  routine_catalog: string;
  routine_name: string;
};

export default class PgClient implements ServerConnectionInterface {
  constructor(model: ConnectionModelType) {
    this.pool = new Pool({
      host: model.address,
      port: model.port,
      password: model.password,
      user: model.username,
      database: 'React',
    });
  }

  pool: Pool;

  public async getDatabasesQuery(): Promise<unknown> {
    const client = await this.pool.connect();
    const result = await client.query(
      `select datname from pg_catalog.pg_database where datistemplate = false`
    );
    client.release();
    return Promise.all(
      result.rows.map((row: DBQuery) => {
        return row.datname;
      })
    );
  }

  public async fetchProceduresQuery(): Promise<string[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT routine_catalog, routine_name FROM information_schema.routines WHERE routine_type = 'PROCEDURE'`
    );
    client.release();
    return Promise.all(
      result.rows.map((row: DBProcedure) => {
        log.verbose(row.routine_name);
        return row.routine_name;
      })
    );
  }

  public async fetchContentQuery(procedure: string): Promise<string[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT prosrc FROM pg_proc WHERE proname = '${procedure}'`
    );
    client.release();
    return result.rows[0].prosrc;
  }
}
