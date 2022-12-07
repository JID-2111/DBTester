import { ExecutionModelType } from './ExecutionModel';
import { UnitTestType } from './UnitTestModels';

export type RuleModelType = {
  id?: number;
  name: string;
  testData: string;
  unitTests: UnitTestType[];
  execution: ExecutionModelType;
  hasTestData: boolean;
  testDataParameterIndex: number;
  testDataFilePath: string;
  parameters: string[];
  cleanupTables?: string[];
};
