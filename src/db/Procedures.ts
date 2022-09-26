import { ConnectionModel } from './Models';
import PgClient from './PgClient';

const model = new ConnectionModel();
model.nickname = 'something_dumb';
model.username = 'kpmg';
model.password = 'asdf';
model.address = 'localhost';

const pgClient = new PgClient(model); // TODO use react context

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
    return pgClient.getDatabasesQuery();
  }

  public async fetchProcedures(): Promise<string[]> {
    return pgClient.fetchProceduresQuery();
  }

  public async fetchContent(procedure: string): Promise<string[]> {
    return pgClient.fetchContentQuery(procedure);
  }
}
