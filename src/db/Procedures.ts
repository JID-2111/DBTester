const { Client } = require('pg');

type DBProcedure = {
  routine_catalog: string;
  routine_name: string;
};

type DBQuery = {
  datname: string;
};

export default class Procedures {
  address: string;

  port: number;

  public async getProceduresForDB(
    databases: string[]
  ): Promise<Map<string, string[]>> {
    const res = new Map<string, string[]>();
    await Promise.all(
      databases.map(async (database) => {
        const procedures = await this.fetchProcedures(database);
        res.set(database, procedures);
      })
    );
    return res;
  }

  public async getDatabases() {
    const database = 'React';
    const client = await new Client({
      host: this.address,
      port: this.port,
      password: 'asdf',
      user: 'kpmg',
      database,
    });
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

  public async fetchProcedures(database: string): Promise<string[]> {
    const client = await new Client({
      host: this.address,
      port: this.port,
      password: 'asdf',
      user: 'kpmg',
      database,
    });
    client.connect();
    const result = await client.query(
      `SELECT routine_catalog, routine_name FROM information_schema.routines WHERE routine_type = 'PROCEDURE'`
    );
    client.end();
    return Promise.all(
      result.rows.map((row: DBProcedure) => {
        return row.routine_name;
      })
    );
  }

  public async fetchContent(
    database: string,
    procedure: string
  ): Promise<string[]> {
    const client = await new Client({
      host: this.address,
      port: this.port,
      password: 'asdf',
      user: 'kpmg',
      database,
    });
    client.connect();
    const result = await client.query(
      `SELECT prosrc FROM pg_proc WHERE proname = '${procedure}'`
    );
    client.end();
    return result.rows[0].prosrc;
  }

  constructor() {
    // TODO get address from user
    this.address =
      process.env.NODE_ENV === 'development' ? 'localhost' : 'localhost';
    this.port = 5432;
  }
}
