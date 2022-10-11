import { DataSource } from 'typeorm';
import { getDataPath } from './main/util';
import ConnectionEntity from './db/entity/ConnectionEntity';
import 'reflect-metadata';
import ExecutionEntity from './db/entity/ExecutionEntity';
import RuleEntity from './db/entity/RuleEntity';
import {
  RowTestEntity,
  TableTestEntity,
  UnitTestEntity,
} from './db/entity/UnitTestEntity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: `${getDataPath()}/UserData.sqlite3`, // TODO use UserData folder
  entities: [
    ConnectionEntity,
    ExecutionEntity,
    RuleEntity,
    UnitTestEntity,
    TableTestEntity,
    RowTestEntity,
  ],
  synchronize: true, // TODO might need to remove for production
});

export default AppDataSource;
