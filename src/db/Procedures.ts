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
    return store.getState().connection.serverConnection.getDatabasesQuery();
  }

  public async fetchProcedures(): Promise<string[]> {
    return store.getState().connection.serverConnection.fetchProceduresQuery();
  }

  public async triggerProcedure(procedure: string, parameters: string[]) {
    return store
      .getState()
      .connection.serverConnection.callProcedureQuery(procedure, parameters);
  }

  public async getProcedureParameters(
    procedure: string
  ): Promise<ProcedureParameter[]> {
    return store
      .getState()
      .connection.serverConnection.fetchProcedureParametersQuery(procedure);
  }

  public async fetchContent(procedure: string): Promise<string[]> {
    return store
      .getState()
      .connection.serverConnection.fetchContentQuery(procedure);
  }
}
