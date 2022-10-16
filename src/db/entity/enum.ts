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

export enum TableGenericOperations {
  EXISTS,
  COUNT,
}

/**
 * Methods for validating string attributes
 */
export enum RowStringOperations {
  CONTAINS, // attribute contains value
  EXACTLY, // attribute exactly matches value
  REGEX, // attribute matches regex statement
}

/**
 * Methods for validating IDs
 */
export enum RowIDOperations {
  ID_INPUT, // record ID is in set provided by user
  ID_TEST, // record ID is in test dataset
}

/**
 * Methods for validating number attributes
 */
export enum RowNumberOperations {
  LT = '<',
  LTE = '<=',
  GT = '>',
  GTE = '>=',
  EQ = '==',
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
