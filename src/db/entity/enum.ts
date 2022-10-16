// Enum is in a separate file so the Entity isn't also imported when used
// Causes issues with Electron when imported in front end

export enum DBProvider {
  PostgreSQL = 'PostgreSQL',
}

export enum TestLevel {
  TABLE,
  ROW,
}

export enum TableOperations {
  EXISTS,
  COUNT,
}

export enum RowOperations {
  CONTAINS, // attribute contains value
  EXACTLY, // attribute exactly matches value
  REGEX, // attribute matches regex statement
  ID_INPUT, // record ID is in set provided by user
  ID_TEST, // record ID is in test dataset
}

export enum OutputFormat {
  JSON, // Return a JSON string from a test
  PLAIN, // Return a simple message
}
