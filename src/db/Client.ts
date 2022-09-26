import { ConnectionModelType } from './Models';

const { Client } = require('pg');

export default class PgClient {
  static model: ConnectionModelType;

  public static async newClient(): Promise<any> {
    return new Client({
      host: PgClient.model.address,
      port: PgClient.model.port,
      password: PgClient.model.password,
      user: PgClient.model.username,
      database: 'React',
    });
  }

  constructor(model: ConnectionModelType) {
    PgClient.model = model;
  }
}
