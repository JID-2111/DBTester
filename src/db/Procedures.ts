import { ConnectionModel } from './Models';
import { store } from './redux/store';

const model = new ConnectionModel();
model.nickname = 'something_dumb';
model.username = 'kpmg';
model.password = 'asdf';
model.address = 'localhost';

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
    return store.getState().connection.serverConnection.getDatabasesQuery();
  }

  public async fetchProcedures(): Promise<string[]> {
    return store.getState().connection.serverConnection.fetchProceduresQuery();
  }

  public async fetchContent(procedure: string): Promise<string[]> {
    return store
      .getState()
      .connection.serverConnection.fetchContentQuery(procedure);
  }
}
