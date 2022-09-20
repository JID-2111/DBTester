import { Repository } from 'typeorm';
import AppDataSource from '../../data-source';
import ConnectionEntity from '../entity/ConnectionEntity';
import { ConnectionModel } from '../Models';

export default class ConnectionService {
  repository: Repository<ConnectionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConnectionEntity);
  }

  public async fetch(): Promise<ConnectionModel[]> {
    const entities = await this.repository.find();
    return entities as ConnectionModel[];
  }

  public async create(model: ConnectionModel) {
    const entity = await this.repository.save(new ConnectionEntity(model));
    this.select(entity.id);
  }

  public async select(id: number) {
    const entity = await this.repository.findOneBy({ id });
    if (entity === null) return;
    entity.lastUsed = new Date();
    this.repository.save(entity);
    // TODO Set react context
  }

  public async delete(id: number) {
    const entity = await this.repository.findOneBy({ id });
    // TODO add logging
    if (!entity) return;
    await this.repository.remove(entity);
  }
}
