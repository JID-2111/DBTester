import { Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import log from 'electron-log';
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
} from '../entity/enum';
import { store } from '../redux/store';
import RowTestService from './RowTestService';
import TableTestService from './TableTestService';

export default class ExecutionService {
  repository: Repository<ExecutionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ExecutionEntity);
  }

  private entityToModel(entity: ExecutionEntity): ExecutionModelType {
    const execution = instanceToPlain(entity) as unknown as ExecutionModelType;
    execution.rules = execution.rules.map((rule) => {
      rule.unitTests = rule.unitTests.map((unitTest) => {
        unitTest.rule = rule;
        return unitTest;
      });
      return rule;
    });
    return execution;
  }

  public async delete(id: number) {
    return this.repository.delete(id);
  }

  public async fetch(): Promise<ExecutionModelType[]> {
    const entities = await this.repository.find({
      order: {
        timestamp: 'DESC',
      },
    });
    return entities.map((entity) => {
      return this.entityToModel(entity);
    });
  }

  public async getMostRecent(): Promise<ExecutionModelType> {
    const entity = await this.repository.find({
      order: {
        timestamp: 'DESC',
      },
      take: 1,
    });
    return this.entityToModel(entity[0]);
  }

  private getClient(database: string) {
    return store.getState().connection.database.get(database);
  }

  public async checkPassFail(test: ExecutionModelType) {
    const tableRows: { [key: string]: number } = {};
    test.rules.forEach((rule: RuleModelType) => {
      rule.unitTests.forEach(async (unitTest: UnitTestType) => {
        const { table } = unitTest;
        tableRows[table] = Number(
          await this.getClient(test.database)?.numRecordsInTable(table)
        );
      });
    });
    await Promise.all(
      test.rules.map(async (rule: RuleModelType) => {
        new Procedures().triggerProcedure(test.procedure, rule.parameters);
        return Promise.all(
          rule.unitTests.map(async (unitTest: UnitTestType) => {
            const { expectedRecordMatches, total, expectedNumRecords, table } =
              unitTest;
            switch (unitTest.level) {
              case UnitTestOperations.TableGenericOperations: {
                const res = await new TableTestService().check(
                  unitTest as TableTestType,
                  test
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
                  unitTest as RowTestType,
                  test
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
    // Cleanup
    await Promise.all(
      test.rules.map(async (rule: RuleModelType) => {
        if (rule.cleanupTables !== undefined) {
          return this.getClient(test.database)?.deleteFromTablesQuery(
            rule.testData,
            rule.cleanupTables
          );
        }
        return null;
      })
    );
    try {
      const res = plainToInstance(ExecutionEntity, test, {
        enableCircularCheck: true,
      });
      const created = await this.repository.save(res);
      return this.entityToModel(created);
    } catch (e) {
      log.error(e);
    }
    return test;
  }
}
