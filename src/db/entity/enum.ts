// Enum is in a separate file so the Entity isn't also imported when used
// Causes issues with Electron when imported in front end

export enum DBProvider {
  PostgreSQL = 'PostgreSQL',
}

/**
 * Operations for row tests based on the column type
 */
export enum UnitTestOperations {
  TableGenericOperations = 'table',
  RowStringOperations = 'string',
  RowNumberOperations = 'number',
  RowIDOperations = 'id',
  RowBooleanOperations = 'boolean',
}

/**
 * How to validate number of records
 */
export enum RecordMatches {
  ZERO,
  GREATER_THAN,
  TABLE_ROWS,
}

export enum TableGenericOperations {
  EXISTS = 'exists',
  COUNT = 'count',
}

/**
 * Methods for validating string attributes
 */
export enum RowStringOperations {
  CONTAINS = 'contains', // attribute contains value
  EXACTLY = 'exactly', // attribute exactly matches value
  REGEX = 'pegex', // attribute matches regex statement
}

/**
 * Methods for validating IDs
 */
export enum RowIDOperations {
  ID_INPUT = 'input', // record ID is in set provided by user
  ID_TEST = 'test', // record ID is in test dataset
}

/**
 * Methods for validating number attributes
 */
export enum RowNumberOperations {
  LT = '<',
  LTE = '<=',
  GT = '>',
  GTE = '>=',
  EQ = '=',
}

/**
 * Methods for validating boolean attributes
 */
export enum RowBooleanOperations {
  TRUE = 'true',
  FALSE = 'false',
}

export enum OutputFormat {
  JSON, // Return a JSON string from a test
  PLAIN, // Return a simple message
}
