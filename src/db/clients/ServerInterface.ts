import { Pool } from 'pg';
import { RowNumberOperations } from '../entity/enum';
import { ConnectionModelType } from '../models/ConnectionModels';
import { ProcedureParameter } from '../Procedures';
import { DBColumn } from './PgClient';

interface ServerInterface {
  pool: Pool;

  model: ConnectionModelType;

  verify(): Promise<boolean>;

  getDatabasesQuery(): Promise<unknown>;

  fetchProceduresQuery(): Promise<string[]>;

  fetchContentQuery(procedure: string): Promise<string>;

  importTestDataTable(file: string, table: string): Promise<void>;

  fetchProcedureParametersQuery(
    procedure: string
  ): Promise<ProcedureParameter[]>;

  fetchColumnsQuery(tb_name: string): Promise<DBColumn[]>;

  fetchTablesQuery(): Promise<string[]>;

  callProcedureQuery(
    procedure: string,
    parameters: string[]
  ): Promise<string[]>;

  /**
   * Check if a table exists
   * @param table table to check
   * @returns whether the table exists or not
   */
  checkTableExists(table: string): Promise<boolean>;

  /**
   * Find the number of rows in table
   * @param table table to check
   * @returns the number of rows in a table if it exists, zero otherwise
   */
  numRecordsInTable(table: string): Promise<number>;

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

  /**
   * Looks for rows where column contains values that compare to a certain value
   * @param table the table to check
   * @param column attribute to check
   * @param value value to compare against
   * @param comparison whether the fields should be less than/ less than equal to/ greater than/greater than equal to/equal to value
   */
  checkNumber(
    table: string,
    column: string,
    value: number,
    comparison: RowNumberOperations
  ): Promise<unknown[]>;

  deleteFromTablesQuery(idTable: string, targets: string[]): Promise<void>;
}

export default ServerInterface;
