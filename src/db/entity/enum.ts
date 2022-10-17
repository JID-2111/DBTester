// Enum is in a separate file so the Entity isn't also imported when used
// Causes issues with Electron when imported in front end

export enum DBProvider {
  PostgreSQL = 'PostgreSQL',
}

export enum TestLevel {
  TABLE,
  COL,
}

export enum TableOperations {
  EXISTS = 'Exists',
  COUNT = 'Count',
}

export enum RowOperations {
  CONTAINS = 'Contains', // attribute contains value
  EXACTLY = 'Is Exactly', // attribute exactly matches value
  REGEX = 'Matches Regex', // attribute matches regex statement
  ID_INPUT = 'Input ID', // record ID is in set provided by user
  ID_TEST = 'Test ID', // record ID is in test dataset
}
