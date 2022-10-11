import { Repository } from 'typeorm';
import AppDataSource from '../../data-source';
import { setLog } from '../../main/util';
import { DBProvider } from '../entity/enum';
import ExecutionEntity from '../entity/ExecutionEntity';
import ConnectionService from './ConnectionService';

export default class ExecutionService {
  repository: Repository<ExecutionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ExecutionEntity);
  }

  public async test() {
    await AppDataSource.initialize();
    setLog();
    const c1 = await new ConnectionService().create({
      id: 1,
      type: DBProvider.PostgreSQL,
      nickname: 'something_dumb',
      connectionConfig: {
        defaultDatabase: 'React',
        config: 'manual',
        username: 'kpmg',
        password: 'asdf',
        address: 'localhost',
        port: 5432,
      },
    });
    const c2 = await new ConnectionService().create({
      id: 2,
      type: DBProvider.PostgreSQL,
      nickname: 'something_dumber',
      connectionConfig: {
        defaultDatabase: 'React',
        config: 'manual',
        username: 'kpmg',
        password: 'asdf',
        address: 'localhost',
        port: 5432,
      },
    });

    await Promise.all(
      [1, 2, 3].map(async (id) => {
        const execution = new ExecutionEntity();
        execution.id = id;
        execution.timestamp = new Date();
        execution.testData = 'test';
        execution.connections = [c1, c2];

        return this.repository.save(execution);
      })
    );

    await Promise.all(
      [4, 5, 6].map(async (id) => {
        const execution = new ExecutionEntity();
        execution.id = id;
        execution.timestamp = new Date();
        execution.testData = 'test';
        execution.connections = [c2];

        return this.repository.save(execution);
      })
    );

    await new ConnectionService().repository.remove(c2);
  }
}

new ExecutionService().test();
