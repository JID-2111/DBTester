import {
  OutputFormat,
  RowOperations,
  TableOperations,
  TestLevel,
} from '../entity/enum';
import { RuleModel } from './RuleModel';

export interface UnitTestType {
  name: string;
  rule: RuleModel;
  result: boolean;
  output: string;
  format: OutputFormat;
}

export interface TableTestType extends UnitTestType {
  operation: TableOperations;
  tableName: string;
  count?: number;
}

export interface RowTestType extends UnitTestType {
  operation: RowOperations;
  column: string;
  value?: string;
}

export class RowTestModel {
  name: string;

  rule: RuleModel;

  result: boolean;

  output: string;

  format: OutputFormat;

  type: TestLevel = TestLevel.ROW;

  operation: RowOperations;

  column: string;

  value?: string;

  constructor(model: RowTestType) {
    Object.assign(this, model);
  }
}
