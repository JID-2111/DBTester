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

  public async ProceduresToDatabaseMap(
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
    client.connect((err: any) => {
      if (err) {
        console.error('connection error', err.stack);
      } else {
        console.log('connected');
      }
    });
    const result = await client.query(
      `select datname from pg_catalog.pg_database where datistemplate = false`
    );
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
    client.connect((err: any) => {
      if (err) {
        console.error('connection error', err.stack);
      } else {
        console.log('connected');
      }
    });
    const result = await client.query(
      `SELECT routine_catalog, routine_name FROM information_schema.routines WHERE routine_type = 'PROCEDURE'`
    );
    return Promise.all(
      result.rows.map((row: DBProcedure) => {
        return row.routine_name;
      })
    );
  }

  constructor() {
    // TODO get address from user
    this.address =
      process.env.NODE_ENV === 'development' ? 'localhost' : 'asdf';
    this.port = 5432;
  }
}

const p = new Procedures();
p.ProceduresToDatabaseMap(['React']);
p.getDatabases();
