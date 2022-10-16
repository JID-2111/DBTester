import { Pool } from 'pg';
import { RowBooleanOperations, RowNumberOperations } from '../entity/enum';
import { ConnectionModelType } from '../models/ConnectionModels';
import { ProcedureParameter } from '../Procedures';

interface ServerInterface {
  pool: Pool;

  model: ConnectionModelType;

  verify(): Promise<boolean>;

  getDatabasesQuery(): Promise<unknown>;

  fetchProceduresQuery(): Promise<string[]>;

  fetchContentQuery(procedure: string): Promise<string[]>;

  fetchProcedureParametersQuery(
    procedure: string
  ): Promise<ProcedureParameter[]>;

  callProcedureQuery(
    procedure: string,
    parameters: string[]
  ): Promise<string[]>;

  /**
   * Check if a table has rows matching a condition
   * @param table table to check
   * @param column attribute to compare
   * @param value value to look for
   * @returns JSON array representing rows matching condition
   */
  checkExact(table: string, column: string, value: string): Promise<unknown[]>;

  /**
   * Check if a table has rows where column contains value
   * @param table table to check
   * @param column attribute to check
   * @param value value to compare against
   * @returns list of rows matching condition
   */
  checkContains(
    table: string,
    column: string,
    value: string
  ): Promise<unknown[]>;

  /**
   * Looks for a row with a IDs from test table
   * @param data table with IDS to look for
   * @param table table to check for IDs
   */
  checkID(data: string, table: string): Promise<unknown[]>;

  checkNumber(
    table: string,
    column: string,
    value: number,
    comparison: RowNumberOperations
  ): Promise<unknown[]>;

  checkTableExists(table: string): Promise<boolean>;

  numRecordsInTable(table: string): Promise<number>;
  // eslint-disable-next-line prettier/prettier, semi
}

export default ServerInterface;
