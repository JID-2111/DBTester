import { ExecutionModelType } from './ExecutionModel';
import { UnitTestType } from './UnitTestModels';

export type RuleModelType =
  | {
      id?: number;
      name: string;
      testData: string;
      unitTests: UnitTestType[];
      execution: ExecutionModelType;
      hasTestData: true;
      testDataParameterIndex: number;
      testDataFilePath: string;
      parameters: string[];
      cleanupTables?: string[];
    }
  | {
      id?: number;
      name: string;
      testData: string;
      unitTests: UnitTestType[];
      execution: ExecutionModelType;
      hasTestData: false;
      parameters: string[];
      cleanupTables?: string[];
    };
