import { Repository } from 'typeorm';
import AppDataSource from '../../data-source';
import ConnectionEntity from '../entity/ConnectionEntity';
import { ConnectionModel, ConnectionModelType } from '../Models';

export default class ConnectionService {
  repository: Repository<ConnectionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConnectionEntity);
  }

  public async fetch(): Promise<ConnectionModel[]> {
    const entities = await this.repository.find();
    return entities as ConnectionModel[];
  }

  public async create(model: ConnectionModelType): Promise<ConnectionModel> {
    model.lastUsed = new Date();
    const entity = await this.repository.save(new ConnectionEntity(model));
    return this.select(entity.id);
  }

  public async select(id: number): Promise<ConnectionEntity> {
    const entity = await this.repository.findOneBy({ id });
    if (entity !== null) {
      entity.lastUsed = new Date();
      return this.repository.save(entity);
    }
    return new ConnectionEntity();
    // TODO Set react context
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
}
