/* eslint-disable import/no-cycle */
export type ConnectionModelType = {
  id: number;

  nickname: string;

  address: string;

  port: number;

  username: string;

  password: string;

  createdDate: Date;

  lastUsed: Date;
};

export class ConnectionModel {
  id: number;

  nickname: string;

  address: string;

  port: number;

  username: string;

  password: string;

  createdDate: Date;

  lastUsed: Date;

  constructor(entity?: ConnectionModelType) {
    Object.assign(this, entity);
  }
}

export class Execution {
  dummy: string;
}
