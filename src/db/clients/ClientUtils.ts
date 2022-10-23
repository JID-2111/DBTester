import { DBProvider } from '../entity/enum';
import { ConnectionModelType } from '../models/ConnectionModels';
import PgClient from './PgClient';

const getRightClient = (model: ConnectionModelType, database?: string) => {
  switch (model.type) {
    case DBProvider.PostgreSQL: {
      return new PgClient(model, database);
    }
    default: {
      return new PgClient(model, database);
    }
  }
};

export default getRightClient;
