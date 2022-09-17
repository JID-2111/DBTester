/* eslint-disable import/no-cycle */
import ConnectionEntity from './entity/ConnectionEntity';

export class ConnectionModel {
  id: number;

  nickname: string;

  address: string;

  port: number;

  username: string;

  password: string;

  createdDate: Date;

  lastUsed: Date;

  constructor(entity: ConnectionEntity) {
    Object.assign(this, entity);
  }
}

export class Execution {
  dummy: string;
}
