import { Repository } from 'typeorm';
import AppDataSource from '../../data-source';
import ExecutionEntity from '../entity/ExecutionEntity';

export default class ConnectionService {
  repository: Repository<ExecutionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ExecutionEntity);
  }
}
