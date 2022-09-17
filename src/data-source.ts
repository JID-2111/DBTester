import { DataSource } from 'typeorm';
import { getDataPath } from './main/util';
import ConnectionEntity from './db/entity/ConnectionEntity';
import 'reflect-metadata';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: `${getDataPath()}/UserData.sqlite3`, // TODO use UserData folder
  entities: [ConnectionEntity],
  synchronize: true, // TODO might need to remove for production
});

export default AppDataSource;
