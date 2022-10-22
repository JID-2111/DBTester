import { TestLevel } from 'db/entity/enum';

export type Condition = {
  testItem: string;
  condition: string;
  value?: string;
  compare?: string;
  operationType: TestLevel;
};

export type Parameter = {
  [key: string]: string;
};
