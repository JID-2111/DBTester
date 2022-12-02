import { ExecutionModelType } from './ExecutionModel';
import { UnitTestType } from './UnitTestModels';

export type RuleModelType = {
  id?: number;
  name: string;
  database: string;
  testData: string;
  unitTests: UnitTestType[];
  execution: ExecutionModelType;
  procedure: string;
  hasTestData: boolean;
  testDataParameterIndex: number;
  testDataFilePath: string;
  parameters: string[];
  cleanupTables?: string[];
};
