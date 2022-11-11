import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import AppDataSource from '../../data-source';
import { UnitTestEntity } from '../entity/UnitTestEntity';
import { UnitTestType } from '../models/UnitTestModels';

export default class UnitTestService {
  repository: Repository<UnitTestEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UnitTestEntity);
  }

  private entityToModel(entity: UnitTestEntity): UnitTestType {
    return instanceToPlain(entity) as unknown as UnitTestType;
  }

  public async fetch(): Promise<UnitTestType[]> {
    const entities = await this.repository.find({
      order: {
        id: 'DESC',
      },
    });
    return entities.map((entity) => {
      return this.entityToModel(entity);
    });
  }
}
