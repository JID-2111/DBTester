import { ConnectionModelType } from './ConnectionModels';
import { RuleModelType } from './RuleModel';

export type ExecutionModelType = {
  id?: number;

  timestamp: Date;

  rules: RuleModelType[];

  connection?: ConnectionModelType;
};
