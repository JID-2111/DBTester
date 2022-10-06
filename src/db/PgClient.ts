import { Pool } from 'pg';
import log from 'electron-log';
import { ConnectionModelType } from './models/ConnectionModels';
import ServerInterface from './ServerInterface';
import { ProcedureParameter, Direction } from './Procedures';

type DBQuery = {
  datname: string;
};

type DBProcedure = {
  routine_catalog: string;
  routine_name: string;
};

export type DBParameter = {
  pronamespace: string;
  proname: string;
  args_def: string;
  arg: string;
};

export default class PgClient implements ServerInterface {
  constructor(model: ConnectionModelType, database?: string) {
    this.model = model;
    this.pool = new Pool({
      host: model.connectionConfig.address,
      port: model.connectionConfig.port,
      password: model.connectionConfig.password,
      user: model.connectionConfig.username,
      database: database ?? 'React',
    });
  }

  pool: Pool;

  model: ConnectionModelType;

  public async verify(): Promise<boolean> {
    let client;
    try {
      client = await this.pool.connect();
    } catch {
      log.warn('Error connecting to database');
      return false;
    }
    client.release();
    return true;
  }

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
        log.silly(row.routine_name);
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

  public async fetchProcedureParametersQuery(
    procedure: string
  ): Promise<ProcedureParameter[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT pronamespace::regnamespace, proname, pg_get_function_arguments(oid) AS args_def, UNNEST(string_to_array(pg_get_function_identity_arguments(oid), ',' )) AS arg FROM pg_proc where proname='${procedure}'`
    );
    client.release();
    return result.rows.map((row: DBParameter) => {
      const parts = row.arg.trim().split(' ');
      return {
        direction: <Direction>parts[0],
        name: parts[1],
        type: parts[2],
      };
    });
  }

  public async callProcedureQuery(procedure: string, parameters: string[]) {
    const client = await this.pool.connect();
    const result = await client.query(
      `CALL ${procedure}(${parameters.join(',')})`
    );
    client.release();
    return result.rows;
  }
}
