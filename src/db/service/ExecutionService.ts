import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import log from 'electron-log';
import { cloneDeep } from 'lodash';
import { ExecutionModelType } from '../models/ExecutionModel';
import AppDataSource from '../../data-source';
import ExecutionEntity from '../entity/ExecutionEntity';
import { RuleModelType } from '../models/RuleModel';
import Procedures from '../Procedures';
import {
  RowTestType,
  TableTestType,
  UnitTestType,
} from '../models/UnitTestModels';
import {
  UnitTestOperations,
  TableGenericOperations,
  RecordMatches,
} from '../entity/enum';
import { store } from '../redux/store';
import RowTestService from './RowTestService';
import TableTestService from './TableTestService';

export default class ExecutionService {
  repository: Repository<ExecutionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ExecutionEntity);
  }

  public async checkPassFail(
    procedure: string,
    parameters: string[],
    test: ExecutionModelType
  ) {
    const tableRows: { [key: string]: number } = {};
    test.rules.forEach((rule: RuleModelType) => {
      rule.unitTests.forEach(async (unitTest: UnitTestType) => {
        const { table } = unitTest;
        tableRows[table] = Number(
          await store
            .getState()
            .connection.database.get(unitTest.rule.database)
            ?.numRecordsInTable(table)
        );
      });
    });
    new Procedures().triggerProcedure(procedure, parameters);
    const resultRules: RuleModelType[] = cloneDeep(test.rules);
    for (let i = 0; i < resultRules.length; i += 1) {
      resultRules[i].unitTests = [];
    }
    await Promise.all(
      test.rules.map(async (rule: RuleModelType) => {
        return Promise.all(
          rule.unitTests.map(async (unitTest: UnitTestType) => {
            const { expectedRecordMatches, total, expectedNumRecords, table } =
              unitTest;
            let result = false;
            let output = '';
            switch (unitTest.level) {
              case UnitTestOperations.TableGenericOperations: {
                const res = await new TableTestService().check(
                  unitTest as TableTestType
                );
                if (unitTest.operation === TableGenericOperations.EXISTS) {
                  result = Boolean(res);
                  output = `${unitTest.table} table exists is ${result}`;
                } else {
                  switch (expectedRecordMatches) {
                    case RecordMatches.ZERO:
                      result = Number(res) === 0;
                      output = `${unitTest.table} had ${Number(
                        res
                      )} rows and expected 0 rows`;
                      break;
                    case RecordMatches.GREATER_THAN:
                      result = Number(res) > 0;
                      output = `${unitTest.table} had ${Number(
                        res
                      )} rows and expected more than 0 rows`;
                      break;
                    case RecordMatches.TABLE_ROWS:
                      if (total) {
                        result = Number(res) === expectedNumRecords;
                        output = `${unitTest.table} had ${Number(
                          res
                        )} rows and expected ${expectedNumRecords} rows`;
                      } else {
                        result =
                          Number(res) - tableRows[table] === expectedNumRecords;
                        output = `${unitTest.table} had ${
                          Number(res) - tableRows[table]
                        } new rows and expected ${expectedNumRecords} new rows`;
                      }
                      break;
                    default:
                      result = false;
                      break;
                  }
                }
                break;
              }
              case UnitTestOperations.RowBooleanOperations:
              case UnitTestOperations.RowIDOperations:
              case UnitTestOperations.RowNumberOperations:
              case UnitTestOperations.RowStringOperations: {
                const rows = await new RowTestService().check(
                  unitTest as RowTestType
                );
                switch (expectedRecordMatches) {
                  case RecordMatches.ZERO:
                    result = Number(rows?.length) === 0;
                    output = `First 10 rows: ${JSON.stringify(
                      rows?.slice(0, 10)
                    )}`;
                    break;
                  case RecordMatches.GREATER_THAN:
                    unitTest.result = Number(rows?.length) > 0;
                    output = `First 10 rows: ${JSON.stringify(
                      rows?.slice(0, 10)
                    )}`;
                    break;
                  case RecordMatches.TABLE_ROWS:
                    if (total) {
                      result = Number(rows?.length) === expectedNumRecords;
                      output = `${unitTest.table} had ${Number(
                        rows?.length
                      )} rows and expected ${expectedNumRecords} rows`;
                    } else {
                      result =
                        Number(rows?.length) - tableRows[table] ===
                        expectedNumRecords;
                      output = `${unitTest.table} had ${
                        Number(rows?.length) - tableRows[table]
                      } new rows and expected ${expectedNumRecords} new rows`;
                    }
                    break;
                  default:
                    result = false;
                    break;
                }
                break;
              }
              default: {
                break;
              }
            }
            const curr = resultRules.find((resultRule) => {
              return resultRule.ruleId === rule.ruleId;
            });
            const cloned = cloneDeep(unitTest);
            cloned.result = result;
            cloned.output = output;
            curr?.unitTests.push(cloned);
          })
        );
      })
    );
    test.rules = resultRules;
    try {
      const res = plainToInstance(ExecutionEntity, test, {
        enableCircularCheck: true,
      });
      this.repository.save(res);
    } catch (e) {
      log.error(e);
    }
  }
}
