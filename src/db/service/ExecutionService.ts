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
}
