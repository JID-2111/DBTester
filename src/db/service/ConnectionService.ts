import { Repository } from 'typeorm';
import log from 'electron-log';
import { safeStorage } from 'electron';
import {
  clear,
  change,
  setDB,
} from '../redux/ServerConnections/ServerConnection';
import { store } from '../redux/store';
import PgClient from '../PgClient';
import AppDataSource from '../../data-source';
import { ConnectionModel, ConnectionModelType } from '../Models';
import ConnectionEntity from '../entity/ConnectionEntity';
import DBProvider from '../entity/enum';

export default class ConnectionService {
  repository: Repository<ConnectionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConnectionEntity);
  }

  public async fetch(): Promise<ConnectionModel[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => {
      return new ConnectionModel(entity);
    });
  }

  public async create(model: ConnectionModelType): Promise<ConnectionEntity> {
    model.lastUsed = new Date();
    if (model.connectionConfig.config === 'manual') {
      if (safeStorage.isEncryptionAvailable()) {
        model.connectionConfig.password = safeStorage
          .encryptString(model.connectionConfig.password)
          .toString('base64');
      } else {
        throw new Error('Error Encrypting Password');
      }
    }
    const entity = await this.repository.save(new ConnectionEntity(model));
    return this.select(entity.id);
  }

  public async select(id: number): Promise<ConnectionEntity> {
    const entity = await this.repository.findOneBy({ id });
    if (entity !== null) {
      entity.lastUsed = new Date();
      const model = new ConnectionModel(entity);
      if (model.connectionConfig.config === 'manual') {
        model.connectionConfig.password = safeStorage.decryptString(
          Buffer.from(model.connectionConfig.password, 'base64')
        );
      }
      store.dispatch(change(new PgClient(model))); // TODO instantiate based on model.type
      return this.repository.save(entity);
    }
    return new ConnectionEntity();
  }

  public async delete(id: number): Promise<void> {
    const entity = await this.repository.findOneBy({ id });
    // TODO add logging
    if (!entity) return;
    await this.repository.remove(entity);
  }

  public async disconnect(): Promise<void> {
    store
      .getState()
      .connection.serverConnection.pool.end()
      .then(() => log.info('Curr Connection Pool Ended'))
      .catch(() => log.error('Couldnt end Pool'));
    store.dispatch(clear());
  }

  public async update(model: ConnectionModelType): Promise<void> {
    const entity = await this.repository.findOneBy({ id: model.id });
    if (entity !== null) {
      Object.assign(entity, model);
      entity.lastUsed = new Date();
      await this.repository.save(entity);
    }
  }

  public async switch(database: string): Promise<boolean> {
    store.dispatch(setDB(database)); // TODO instantiate based on model.type
    if (!(await this.verify())) {
      store.dispatch(clear());
      return false;
    }
    return true;
  }

  public async verify(): Promise<boolean> {
    // Check if the current connection is marked valid and works
    return store.getState().connection.valid
      ? store.getState().connection.serverConnection.verify()
      : false;
  }

  public async test() {
    // await AppDataSource.initialize();
    const model = new ConnectionModel();
    model.connectionConfig = {
      config: 'manual',
      username: 'kpmg',
      password: 'asdf',
      address: 'localhost',
      port: 1024,
    };
    model.nickname = 'something_stupid';
    model.type = DBProvider.PostgreSQL;
    this.create(model);
  }
}

// new ConnectionService().test();
