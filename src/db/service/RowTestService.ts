import { RowIDOperations, RowStringOperations } from '../entity/enum';
import {
  RowBooleanEntity,
  RowIDEntity,
  RowNumberEntity,
  RowStringEntity,
} from '../entity/UnitTestEntity';
import { store } from '../redux/store';

type RowTestTypes =
  | RowStringEntity
  | RowIDEntity
  | RowNumberEntity
  | RowBooleanEntity;

class RowTestService {
  public create(fields: unknown) {
    return fields;
  }

  private getClient(database: string) {
    return store.getState().connection.database.get(database);
  }

  public check(test: RowTestTypes) {
    if (test.type === 'string') {
      switch (test.operation) {
        case RowStringOperations.EXACTLY:
          return this.getClient(test.rule.database)?.checkExact(
            test.table,
            test.column ?? '',
            test.value as string
          );
        case RowStringOperations.CONTAINS:
          return this.getClient(test.rule.database)?.checkContains(
            test.table,
            test.column ?? '',
            test.value as string
          );
        default:
          return null;
      }
    } else if (test.type === 'id') {
      switch (test.operation) {
        case RowIDOperations.ID_TEST:
          return this.getClient(test.rule.database)?.checkID(
            test.rule.testData,
            test.table
          );
        default:
          return null;
      }
    } else if (test.type === 'number') {
      return this.getClient(test.rule.database)?.checkNumber(
        test.table,
        test.column ?? '',
        Number(test.value),
        test.operation
      );
    } else if (test.type === 'boolean') {
      return this.getClient(test.rule.database)?.checkBoolean(
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
