import { Repository } from 'typeorm';
import { change } from '../redux/ServerConnections/ServerConnection';
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
    const entity = await this.repository.save(new ConnectionEntity(model));
    return this.select(entity.id);
    // return entity;
  }

  public async select(id: number): Promise<ConnectionEntity> {
    const entity = await this.repository.findOneBy({ id });
    if (entity !== null) {
      entity.lastUsed = new Date();
      store.dispatch(change(new PgClient(new ConnectionModel(entity))));
      return this.repository.save(entity);
    }
    return new ConnectionEntity();
  }

  public async delete(id: number) {
    const entity = await this.repository.findOneBy({ id });
    // TODO add logging
    if (!entity) return;
    await this.repository.remove(entity);
  }

  public async update(model: ConnectionModelType): Promise<void> {
    const entity = await this.repository.findOneBy({ id: model.id });
    if (entity !== null) {
      Object.assign(entity, model);
      entity.lastUsed = new Date();
      await this.repository.save(entity);
    }
  }

  public async test() {
    await AppDataSource.initialize();
    const service = new ConnectionService();

    const manual = new ConnectionModel({
      id: 1,
      nickname: 'manual',
      type: DBProvider.PostgreSQL,
      connectionConfig: {
        config: 'manual',
        address: 'asdf',
        port: 123,
        password: 'test',
        username: 'asdf',
      },
    });
    console.log('Created manual', manual);
    await service.create(manual);
    const cs = new ConnectionModel({
      id: 2,
      nickname: 'CS',
      type: DBProvider.PostgreSQL,
      connectionConfig: {
        config: 'string',
        connectionString: 'connectstring',
      },
    });
    console.log('Created connection string', cs);
    await service.create(cs);

    console.log('Created entries:');
    console.log(await service.fetch());
  }
}

// new ConnectionService().test();
