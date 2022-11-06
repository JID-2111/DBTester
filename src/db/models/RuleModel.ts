import { ExecutionModelType } from './ExecutionModel';
import { UnitTestType } from './UnitTestModels';

export type RuleModelType = {
  name: string;
  ruleId: number;
  database: string;
  testData: string;
  unitTests: UnitTestType[];
  execution: ExecutionModelType;
  procedure: string;
  parameters: string[];
  cleanupTables: string[];
};
