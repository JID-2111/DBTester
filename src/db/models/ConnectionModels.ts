import ConnectionEntity from '../entity/ConnectionEntity';
import { DBProvider } from '../entity/enum';

export type ManualConnectionConfig = {
  config: 'manual';

  defaultDatabase: string;

  address: string;

  port: number;

  username: string;

  password: string;
};

export type ConnectionString = {
  config: 'string';

  connectionString: string;
};

type ConnectionInfo = {
  id?: number;

  nickname: string;

  type: DBProvider;

  createdDate?: Date;

  lastUsed?: Date;
};

export type ConnectionInputType = ConnectionInfo & {
  connectionConfig: ManualConnectionConfig | ConnectionString;
};

export type ConnectionModelType = ConnectionInfo & {
  connectionConfig: ManualConnectionConfig;
};

export class ConnectionModel {
  id: number;

  nickname: string;

  type: DBProvider;

  connectionConfig: ManualConnectionConfig;

  createdDate: Date;

  lastUsed: Date;

  constructor(model?: ConnectionEntity) {
    if (model === undefined) return;
    const { nickname, id, createdDate, lastUsed, type, defaultDatabase } =
      model;
    Object.assign(this, {
      nickname,
      id,
      createdDate,
      lastUsed,
      type,
    });
    const { username, password, address, port } = model;
    this.connectionConfig = {
      config: 'manual',
      defaultDatabase,
      username,
      password,
      address,
      port,
    };
  }
}

export class Execution {
  dummy: string;
}
