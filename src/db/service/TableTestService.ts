import { TableGenericOperations } from '../entity/enum';
import { ExecutionModelType } from '../models/ExecutionModel';
import { TableTestType } from '../models/UnitTestModels';
import { store } from '../redux/store';

class TableTestService {
  private getClient(database: string) {
    return store.getState().connection.database.get(database);
  }

  public check(test: TableTestType, execution: ExecutionModelType) {
    if (test.operation === TableGenericOperations.COUNT) {
      return this.getClient(execution.database)?.numRecordsInTable(test.table);
    }
    if (test.operation === TableGenericOperations.EXISTS) {
      return this.getClient(execution.database)?.checkTableExists(test.table);
    }
    return null;
  }
}

export default TableTestService;
