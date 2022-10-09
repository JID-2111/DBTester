import { Repository } from 'typeorm';
import log from 'electron-log';
import {
  clear,
  change,
  setDB,
} from '../redux/ServerConnections/ServerConnection';
import { store } from '../redux/store';
import AppDataSource from '../../data-source';
import {
  ConnectionInputType,
  ConnectionModel,
  ConnectionModelType,
} from '../models/ConnectionModels';
import ConnectionEntity from '../entity/ConnectionEntity';

export default class ConnectionService {
  repository: Repository<ConnectionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConnectionEntity);
  }

  public async fetch(): Promise<ConnectionModel[]> {
    const entities = await this.repository.find({
      order: {
        lastUsed: 'DESC',
      },
    });
    return entities.map((entity) => {
      return new ConnectionModel(entity);
    });
  }

  public async create(model: ConnectionInputType): Promise<ConnectionEntity> {
    model.lastUsed = new Date();
    const parsedEntity = new ConnectionEntity(model);
    const entity = await this.repository.save(parsedEntity);
    try {
      return await this.select(entity.id);
    } catch (e) {
      this.delete(entity.id);
      throw new Error('Connection is not valid');
    }
  }

  public async select(id: number): Promise<ConnectionEntity> {
    const entity = await this.repository.findOneBy({ id });
    if (entity !== null) {
      entity.lastUsed = new Date();
      const model = new ConnectionModel(entity);
      store.dispatch(change(new PgClient(model))); // TODO instantiate based on model.type
      if (!(await this.verify())) {
        store.dispatch(clear());
        log.error('Connection is not valid');
        throw new Error('Connection is not valid');
      }
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
    /*
    store
      .getState()
      .connection.serverConnection.pool.end()
      .then(() => log.info('Curr Connection Pool Ended'))
      .catch(() => log.error('Couldnt end Pool'));
    */
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
    /*
    return store.getState().connection.valid
      ? store.getState().connection.serverConnection.verify()
      : false;
      */
    return true;
  }
}
