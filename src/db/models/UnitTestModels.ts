import {
  OutputFormat,
  RecordMatches,
  RowBooleanOperations,
  RowIDOperations,
  RowNumberOperations,
  RowStringOperations,
  TableGenericOperations,
  UnitTestOperations,
} from '../entity/enum';
import { RuleModelType } from './RuleModel';

export interface UnitTestType {
  level: UnitTestOperations;

  id?: number;

  name: string;

  expectedRecordMatches: RecordMatches;

  total: boolean;

  expectedNumRecords: number;

  table: string; // table to run test on

  column?: string;

  value?: string;

  operation:
    | TableGenericOperations
    | RowStringOperations
    | RowBooleanOperations
    | RowNumberOperations
    | RowIDOperations;

  result: boolean; // Pass or Fail

  format: OutputFormat; // Format for output field

  output: string; // Debug information

  rule: RuleModelType;
}

export interface TableTestType extends UnitTestType {
  level: UnitTestOperations.TableGenericOperations;

  operation: TableGenericOperations;
}

export interface RowStringTestType extends UnitTestType {
  level: UnitTestOperations.RowStringOperations;

  operation: RowStringOperations;
}

export interface RowIDTestType extends UnitTestType {
  level: UnitTestOperations.RowIDOperations;

  operation: RowIDOperations;
}

export interface RowNumberTestType extends UnitTestType {
  level: UnitTestOperations.RowNumberOperations;

  operation: RowNumberOperations;
}

export interface RowBooleanTestType extends UnitTestType {
  level: UnitTestOperations.RowBooleanOperations;

  operation: RowBooleanOperations;
}

export type RowTestType =
  | RowStringTestType
  | RowIDTestType
  | RowNumberTestType
  | RowBooleanTestType;
