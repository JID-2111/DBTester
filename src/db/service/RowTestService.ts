import { RowTestType } from '../models/UnitTestModels';
import {
  RowIDOperations,
  RowStringOperations,
  UnitTestOperations,
} from '../entity/enum';
import { store } from '../redux/store';
import { ExecutionModelType } from '../models/ExecutionModel';

class RowTestService {
  public create(fields: unknown) {
    return fields;
  }

  private getClient(database: string) {
    return store.getState().connection.database.get(database);
  }

  public check(test: RowTestType, execution: ExecutionModelType) {
    if (test.level === UnitTestOperations.RowStringOperations) {
      switch (test.operation) {
        case RowStringOperations.EXACTLY:
          return this.getClient(execution.database)?.checkExact(
            test.table,
            test.column ?? '',
            test.value as string
          );
        case RowStringOperations.CONTAINS:
          return this.getClient(execution.database)?.checkContains(
            test.table,
            test.column ?? '',
            test.value as string
          );
        default:
          return null;
      }
    } else if (test.level === UnitTestOperations.RowIDOperations) {
      switch (test.operation) {
        case RowIDOperations.ID_TEST:
          return this.getClient(execution.database)?.checkID(
            test.rule.testData,
            test.table
          );
        default:
          return null;
      }
    } else if (test.level === UnitTestOperations.RowNumberOperations) {
      return this.getClient(execution.database)?.checkNumber(
        test.table,
        test.column ?? '',
        Number(test.value),
        test.operation
      );
    } else if (test.level === UnitTestOperations.RowBooleanOperations) {
      return this.getClient(execution.database)?.checkExact(
        test.table,
        test.column ?? '',
        test.operation
      );
    } else {
      return null;
    }
  }
}

export default RowTestService;
