import log from 'electron-log';
import PgClient from './Client';

type DBProcedure = {
  routine_catalog: string;
  routine_name: string;
};

type DBQuery = {
  datname: string;
};

export default class Procedures {
  public async getProceduresForDB(
    databases: string[]
  ): Promise<Map<string, string[]>> {
    const res = new Map<string, string[]>();
    await Promise.all(
      databases.map(async (database) => {
        const procedures = await this.fetchProcedures();
        res.set(database, procedures);
      })
    );
    return res;
  }

  public async getDatabases() {
    const client = await PgClient.newClient();
    client.connect();
    const result = await client.query(
      `select datname from pg_catalog.pg_database where datistemplate = false`
    );
    client.end();
    return Promise.all(
      result.rows.map((row: DBQuery) => {
        return row.datname;
      })
    );
  }

  public async fetchProcedures(): Promise<string[]> {
    const client = await PgClient.newClient();
    client.connect();
    const result = await client.query(
      `SELECT routine_catalog, routine_name FROM information_schema.routines WHERE routine_type = 'PROCEDURE'`
    );
    client.end();
    return Promise.all(
      result.rows.map((row: DBProcedure) => {
        log.verbose(row.routine_name);
        return row.routine_name;
      })
    );
  }

  public async fetchContent(procedure: string): Promise<string[]> {
    const client = await PgClient.newClient();
    client.connect();
    const result = await client.query(
      `SELECT prosrc FROM pg_proc WHERE proname = '${procedure}'`
    );
    client.end();
    return result.rows[0].prosrc;
  }
}
