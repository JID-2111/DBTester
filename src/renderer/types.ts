import {
  RecordMatches,
  RowBooleanOperations,
  RowIDOperations,
  RowNumberOperations,
  RowStringOperations,
  TableGenericOperations,
  UnitTestOperations,
} from 'db/entity/enum';

export type Condition = {
  level?: UnitTestOperations;
  column?: string;
  value?: string;
  operation?:
    | TableGenericOperations
    | RowStringOperations
    | RowBooleanOperations
    | RowNumberOperations
    | RowIDOperations;
  result?: boolean;
  expectedRecordMatches?: RecordMatches;
  expectedNumRecords?: number;
  total?: boolean;
  table?: string;
};

export type Parameter = {
  [key: string]: string;
};
