import { TableGenericOperations } from '../entity/enum';
import { TableTestType } from '../models/UnitTestModels';
import { store } from '../redux/store';

class TableTestService {
  private getClient(database: string) {
    return store.getState().connection.database.get(database);
  }

  public check(test: TableTestType) {
    if (test.operation === TableGenericOperations.COUNT) {
      return this.getClient(test.rule.database)?.numRecordsInTable(test.table);
    }
    if (test.operation === TableGenericOperations.EXISTS) {
      return this.getClient(test.rule.database)?.checkTableExists(test.table);
    }
    return null;
  }
}

export default TableTestService;
