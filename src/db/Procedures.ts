import { store } from './redux/store';

export enum Direction {
  IN = 'IN',
  OUT = 'OUT',
  INOUT = 'INOUT',
}
export type ProcedureParameter = {
  direction: Direction;
  name: string;
  type: string;
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
    const res = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (res === undefined) {
      throw new Error('Database does not exist/is not connected');
    }
    return res.getDatabasesQuery();
  }

  public async fetchProcedures(): Promise<string[]> {
    const res = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (res === undefined) {
      throw new Error('Database does not exist/is not connected');
    }
    return res.fetchProceduresQuery();
  }

  public async triggerProcedure(procedure: string, parameters: string[]) {
    const res = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (res === undefined) {
      throw new Error('Database does not exist/is not connected');
    }
    return res.callProcedureQuery(procedure, parameters);
  }

  public async getProcedureParameters(
    procedure: string
  ): Promise<ProcedureParameter[]> {
    const res = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (res === undefined) {
      throw new Error('Database does not exist/is not connected');
    }
    return res.fetchProcedureParametersQuery(procedure);
  }

  public async fetchContent(procedure: string): Promise<string[]> {
    const res = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (res === undefined) {
      throw new Error('Database does not exist/is not connected');
    }
    return res.fetchContentQuery(procedure);
  }

  public async checkTableExists(table: string): Promise<boolean> {
    const res = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (res === undefined) {
      throw new Error('Database does not exist/is not connected');
    }
    return res.checkTableExists(table);
  }

  public async numRecordsInTable(table: string): Promise<number> {
    const res = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (res === undefined) {
      throw new Error('Database does not exist/is not connected');
    }
    return res.numRecordsInTable(table);
  }
}
