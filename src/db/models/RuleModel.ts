import { ExecutionModelType } from './ExecutionModel';

export type RuleModelType = {
  name: string;
  ruleId: number;
  database: string;
  testData: string;
  execution: ExecutionModelType;
};
