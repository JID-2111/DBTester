import { store } from './redux/store';
import getRightClient from './clients/ClientUtils';

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
    const client = getRightClient(
      store.getState().connection.serverConnectionModel,
      store.getState().connection.database
    );
    return client.getDatabasesQuery();
  }

  public async fetchProcedures(): Promise<string[]> {
    const client = getRightClient(
      store.getState().connection.serverConnectionModel,
      store.getState().connection.database
    );
    return client.fetchProceduresQuery();
  }

  public async triggerProcedure(procedure: string, parameters: string[]) {
    const client = getRightClient(
      store.getState().connection.serverConnectionModel,
      store.getState().connection.database
    );
    return client.callProcedureQuery(procedure, parameters);
  }

  public async getProcedureParameters(
    procedure: string
  ): Promise<ProcedureParameter[]> {
    const client = getRightClient(
      store.getState().connection.serverConnectionModel,
      store.getState().connection.database
    );
    return client.fetchProcedureParametersQuery(procedure);
  }

  public async fetchContent(procedure: string): Promise<string[]> {
    const client = getRightClient(
      store.getState().connection.serverConnectionModel,
      store.getState().connection.database
    );
    return client.fetchContentQuery(procedure);
  }
}
