import { ConnectionModelType } from './ConnectionModels';
import { RuleModelType } from './RuleModel';

export type ExecutionModelType = {
  id?: number;

  name: string;

  database: string;

  procedure: string;

  timestamp: Date;

  rules: RuleModelType[];

  connection?: ConnectionModelType;
};
