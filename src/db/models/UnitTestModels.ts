import { OutputFormat, RowOperations, TableOperations } from '../entity/enum';
import { RuleModelType } from './RuleModel';

export interface UnitTestType {
  name: string;
  rule: RuleModelType;
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
