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
  OutputFormat,
  RowNumberOperations,
} from '../entity/enum';
import { store } from '../redux/store';
import RowTestService from './RowTestService';
import TableTestService from './TableTestService';

const util = require('util');

export default class ExecutionService {
  repository: Repository<ExecutionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ExecutionEntity);
  }

  private getClient(database: string) {
    return store.getState().connection.database.get(database);
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
          await this.getClient(unitTest.rule.database)?.numRecordsInTable(table)
        );
      });
    });
    new Procedures().triggerProcedure(procedure, parameters);
    await Promise.all(
      test.rules.map(async (rule: RuleModelType) => {
        return Promise.all(
          rule.unitTests.map(async (unitTest: UnitTestType) => {
            const { expectedRecordMatches, total, expectedNumRecords, table } =
              unitTest;
            switch (unitTest.level) {
              case UnitTestOperations.TableGenericOperations: {
                const res = await new TableTestService().check(
                  unitTest as TableTestType
                );
                if (unitTest.operation === TableGenericOperations.EXISTS) {
                  unitTest.result = Boolean(res);
                  unitTest.output = `${unitTest.table} table exists is ${unitTest.result}`;
                } else {
                  switch (expectedRecordMatches) {
                    case RecordMatches.ZERO:
                      unitTest.result = Number(res) === 0;
                      unitTest.output = `${unitTest.table} had ${Number(
                        res
                      )} rows and expected 0 rows`;
                      break;
                    case RecordMatches.GREATER_THAN:
                      unitTest.result = Number(res) > 0;
                      unitTest.output = `${unitTest.table} had ${Number(
                        res
                      )} rows and expected more than 0 rows`;
                      break;
                    case RecordMatches.TABLE_ROWS:
                      if (total) {
                        unitTest.result = Number(res) === expectedNumRecords;
                        unitTest.output = `${unitTest.table} had ${Number(
                          res
                        )} rows and expected ${expectedNumRecords} rows`;
                      } else {
                        unitTest.result =
                          Number(res) - tableRows[table] === expectedNumRecords;
                        unitTest.output = `${unitTest.table} had ${
                          Number(res) - tableRows[table]
                        } new rows and expected ${expectedNumRecords} new rows`;
                      }
                      break;
                    default:
                      unitTest.result = false;
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
                    unitTest.result = Number(rows?.length) === 0;
                    unitTest.output = `${unitTest.table} had ${Number(
                      rows?.length
                    )} and expected 0 rows. ${
                      Number(rows?.length) < 10 ? 'All rows' : 'First 10 rows'
                    } matching constraints: ${JSON.stringify(
                      rows?.slice(0, 10)
                    )}`;
                    break;
                  case RecordMatches.GREATER_THAN:
                    unitTest.result = Number(rows?.length) > 0;
                    unitTest.output = `${unitTest.table} had ${Number(
                      rows?.length
                    )} and expected more than 0 rows. ${
                      Number(rows?.length) < 10 ? 'All rows' : 'First 10 rows'
                    } matching constraints: ${JSON.stringify(
                      rows?.slice(0, 10)
                    )}`;
                    break;
                  case RecordMatches.TABLE_ROWS:
                    if (total) {
                      unitTest.result =
                        Number(rows?.length) === expectedNumRecords;
                      unitTest.output = `${unitTest.table} had ${Number(
                        rows?.length
                      )} rows and expected ${expectedNumRecords} rows`;
                    } else {
                      unitTest.result =
                        Number(rows?.length) - tableRows[table] ===
                        expectedNumRecords;
                      unitTest.output = `${unitTest.table} had ${
                        Number(rows?.length) - tableRows[table]
                      } new rows and expected ${expectedNumRecords} new rows`;
                    }
                    break;
                  default:
                    unitTest.result = false;
                    break;
                }
                break;
              }
              default: {
                break;
              }
            }
            unitTest.format = OutputFormat.PLAIN;
          })
        );
      })
    );
    try {
      const res = plainToInstance(ExecutionEntity, test, {
        enableCircularCheck: true,
      });
      console.log('trying to set');
      console.log(
        util.inspect(test, { showHidden: false, depth: 4, colors: true })
      );
      this.repository.save(res);
    } catch (e) {
      log.error(e);
    }
  }

  public async test() {
    try {
      // const connection = {
      //   nickname: 'asdf',
      //   type: DBProvider.PostgreSQL,
      //   defaultDatabase: 'React',
      //   address: 'localhost',
      //   password: 'asdf',
      //   username: 'kpmg',
      //   port: 5432,
      // };
      const execution: ExecutionModelType = {
        timestamp: new Date(),
        rules: [],
      };

      const rule1: RuleModelType = {
        name: 'rule1',
        ruleId: 0,
        database: 'React',
        testData: '',
        unitTests: [],
        execution,
      };

      const rule2: RuleModelType = {
        name: 'rule2',
        ruleId: 1,
        database: 'React',
        testData: '',
        unitTests: [],
        execution,
      };
      const test1: TableTestType = {
        operation: TableGenericOperations.EXISTS,
        level: UnitTestOperations.TableGenericOperations,
        name: 'test1',
        expectedRecordMatches: 0,
        total: false,
        expectedNumRecords: 0,
        table: 'accounts',
        result: false,
        format: OutputFormat.PLAIN,
        output: '',
        rule: rule1,
      };

      const test2: TableTestType = {
        operation: TableGenericOperations.COUNT,
        level: UnitTestOperations.TableGenericOperations,
        name: 'test2',
        expectedRecordMatches: RecordMatches.TABLE_ROWS,
        total: true,
        expectedNumRecords: 10,
        table: 'accounts',
        result: false,
        format: OutputFormat.PLAIN,
        output: '',
        rule: rule1,
      };

      const test3: TableTestType = {
        operation: TableGenericOperations.COUNT,
        level: UnitTestOperations.TableGenericOperations,
        name: 'test3',
        expectedRecordMatches: RecordMatches.TABLE_ROWS,
        total: false,
        expectedNumRecords: 2,
        table: 'accounts',
        result: false,
        format: OutputFormat.PLAIN,
        output: '',
        rule: rule1,
      };

      const test4: RowTestType = {
        operation: RowNumberOperations.LT,
        level: UnitTestOperations.RowNumberOperations,
        name: 'test4',
        expectedRecordMatches: RecordMatches.TABLE_ROWS,
        total: true,
        column: 'balance',
        expectedNumRecords: 2,
        table: 'accounts',
        result: false,
        format: OutputFormat.PLAIN,
        output: '',
        value: '200',
        rule: rule2,
      };

      const test5: RowTestType = {
        operation: RowNumberOperations.EQ,
        level: UnitTestOperations.RowNumberOperations,
        name: 'test5',
        expectedRecordMatches: RecordMatches.GREATER_THAN,
        total: true,
        column: 'balance',
        expectedNumRecords: 2,
        table: 'accounts',
        result: false,
        format: OutputFormat.PLAIN,
        output: '',
        value: '100',
        rule: rule2,
      };

      rule1.unitTests = [test1, test2, test3];
      rule2.unitTests = [test4, test5];
      execution.rules = [rule1, rule2];
      this.checkPassFail('transfer2', ['1', '2', '400'], execution);
    } catch (e) {
      log.error(e);
    }
  }
}
