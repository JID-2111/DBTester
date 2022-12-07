/* eslint import/prefer-default-export: off */
import { ConnectionModelType } from 'db/models/ConnectionModels';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import { ExecutionModelType } from '../../../db/models/ExecutionModel';

export function formatConnectionString(connection: ConnectionModelType) {
  const connectionString =
    `${connection.type.toLowerCase()}://${connection.username}:` +
    `****` +
    `@${connection.address}:${connection.port}/${connection.defaultDatabase}${
      connection.ssl === true ? `?ssl=${connection.ssl}` : ''
    }`;

  return connectionString;
}

export function checkExecutionHasResults(execution: ExecutionModelType) {
  return execution.rules.some((rule: RuleModelType) =>
    rule.unitTests.some((unitTest) => unitTest.result !== null)
  );
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

export function formatCleanupTables(rule: RuleModelType) {
  let string = '';
  if (rule.cleanupTables) {
    rule.cleanupTables.forEach((table, idx) => {
      if (idx === 0) {
        string += table;
      } else {
        string += `, ${table}`;
      }
    });
  }
  return string;
}

export function parseErrorMessage(msg: string) {
  return msg.slice(msg.slice(1, msg.length).search('Error: ') + 1, msg.length);
}
