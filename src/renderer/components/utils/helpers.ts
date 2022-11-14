/* eslint import/prefer-default-export: off */
import { ConnectionModelType } from 'db/models/ConnectionModels';
import { UnitTestType } from 'db/models/UnitTestModels';

export function formatConnectionString(connection: ConnectionModelType) {
  const connectionString =
    `${connection.type}://${connection.username}:` +
    `****` +
    `@${connection.address}:${connection.port}`;

  return connectionString;
}

export function getUnitTestDescription(test: UnitTestType) {
  const {
    level,
    column,
    operation,
    value,
    total,
    expectedRecordMatches,
    expectedNumRecords,
    table,
  } = test;

  return `${level === 'table' ? `table "${table}" ` : ''}
    ${column ? `column "${column}"` : ''}
    ${operation ? `${operation.toUpperCase()} ` : ''}
    ${value ? `"${value}", ` : ''}
    ${total ? `${total} ` : ''}
    ${expectedRecordMatches ? `${expectedRecordMatches} ` : ''}
    ${expectedNumRecords ? `${expectedNumRecords} ` : ''}
    ${operation !== 'exists' ? `in ${table}` : ''}`;
}
