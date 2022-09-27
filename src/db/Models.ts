import ConnectionEntity from './entity/ConnectionEntity';
import DBProvider from './entity/enum';

export type ConnectionModelType = {
  id?: number;

  nickname: string;

  type: DBProvider;

  connectionConfig: ManualConnectionConfig | ConnectionString;

  createdDate?: Date;

  lastUsed?: Date;
};

type ManualConnectionConfig = {
  config: 'manual';

  address: string;

  port: number;

  username: string;

  password: string;
};

type ConnectionString = {
  config: 'string';

  connectionString: string;
};

export class ConnectionModel {
  id: number;

  nickname: string;

  type: DBProvider;

  connectionConfig: ManualConnectionConfig | ConnectionString;

  createdDate: Date;

  lastUsed: Date;

  constructor(model?: ConnectionModelType | ConnectionEntity) {
    if (model === undefined) return;
    if ('connectionConfig' in model) {
      Object.assign(this, model);
    } else {
      const { nickname, id, createdDate, lastUsed, type } = model;
      Object.assign(this, {
        nickname,
        id,
        createdDate,
        lastUsed,
        type,
      });
      this.nickname = model.nickname;
      this.id = model.id;
      this.createdDate = model.createdDate;
      this.lastUsed = model.lastUsed;
      if (model.connectionString !== null) {
        this.connectionConfig = {
          config: 'string',
          connectionString: model.connectionString,
        };
      } else {
        const { username, password, address, port } = model;
        this.connectionConfig = {
          config: 'manual',
          username,
          password,
          address,
          port,
        };
      }
    }
  }
}

export class Execution {
  dummy: string;
}
