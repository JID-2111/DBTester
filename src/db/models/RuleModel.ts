import ExecutionEntity from '../entity/ExecutionEntity';

export type RuleType = {
  name: string;
  ruleId: number;
  database: string;
  testData: string;
  execution: ExecutionEntity;
};

export class RuleModel {
  id: number;

  name: string;

  ruleId: number;

  database: string;

  testData: string;

  execution: ExecutionEntity;

  constructor(model: RuleType) {
    Object.assign(this, model);
  }
}
