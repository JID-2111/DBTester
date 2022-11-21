import { Repository } from 'typeorm';
import log from 'electron-log';
import { instanceToPlain } from 'class-transformer';
import {
  clear,
  change,
  setDB,
} from '../redux/ServerConnections/ServerConnection';
import { store } from '../redux/store';
import AppDataSource from '../../data-source';
import {
  ConnectionInputType,
  ConnectionModelType,
} from '../models/ConnectionModels';
import ConnectionEntity from '../entity/ConnectionEntity';

/**
 * Service for managing {@link ConnectionEntity}.
 */
export default class ConnectionService {
  repository: Repository<ConnectionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConnectionEntity);
  }

  private entityToModel(entity: ConnectionEntity): ConnectionModelType {
    return instanceToPlain(entity) as unknown as ConnectionModelType;
  }

  /**
   * Get a connection entity by id
   * @param id id of the connection
   * @returns Matching ConnectionEntity
   */
  public async findById(id: number): Promise<ConnectionEntity | null> {
    return this.repository.findOneBy({ id });
  }

  public async fetch(): Promise<ConnectionModelType[]> {
    const entities = await this.repository.find({
      order: {
        lastUsed: 'DESC',
      },
    });
    return entities.map((entity) => {
      return this.entityToModel(entity);
    });
  }

  public async create(model: ConnectionInputType): Promise<ConnectionEntity> {
    model.lastUsed = new Date();
    const parsedEntity = new ConnectionEntity(model);
    const entity = await this.repository.save(parsedEntity);
    console.log(this.entityToModel(entity));

    try {
      return await this.select(entity.id);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      log.error(e);
      await this.delete(entity.id);
      throw new Error(e.message);
    }
  }

  public async select(id: number): Promise<ConnectionEntity> {
    const entity = await this.repository.findOneBy({ id });
    if (entity !== null) {
      entity.lastUsed = new Date();
      store.dispatch(change(this.entityToModel(entity)));

      try {
        await this.verify();

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (e: any) {
        store.dispatch(clear());
        log.error(e.message);
        throw new Error(e.message);
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
    const connection = store
      .getState()
      .connection.database.get(store.getState().connection.currentDatabase);
    if (connection === undefined) {
      return false;
    }

    try {
      return await connection.verify();

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      log.error(e);
      throw new Error(e.message);
    }
  }
}
