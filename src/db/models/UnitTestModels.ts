import {
  OutputFormat,
  RowBooleanOperations,
  RowIDOperations,
  RowNumberOperations,
  RowStringOperations,
  TableGenericOperations,
  UnitTestOperations,
} from '../entity/enum';
import RuleEntity from '../entity/RuleEntity';

export interface UnitTestType {
  level: UnitTestOperations;

  id: number;

  name: string;

  table: string; // table to run test on

  column?: string;

  value?: string;

  type: 'string' | 'number' | 'id' | 'boolean' | 'table';

  operation:
    | TableGenericOperations
    | RowStringOperations
    | RowBooleanOperations
    | RowNumberOperations
    | RowIDOperations;

  result: boolean; // Pass or Fail

  format: OutputFormat; // Format for output field

  output: string; // Debug information

  rule: RuleEntity;
}
