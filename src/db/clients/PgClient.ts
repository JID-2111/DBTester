import { Pool } from 'pg';
import fs from 'fs';
import log from 'electron-log';
import { ConnectionModelType } from '../models/ConnectionModels';
import ServerInterface from './ServerInterface';
import { ProcedureParameter, Direction } from '../Procedures';
import { RowNumberOperations } from '../entity/enum';

const copyFrom = require('pg-copy-streams').from;

type DBQuery = {
  datname: string;
};

type DBProcedure = {
  routine_catalog: string;
  routine_name: string;
};

type DBTablename = {
  tablename: string;
};

export type DBColumn = {
  column_name: string;
  data_type: string;
};

export type DBParameter = {
  pronamespace: string;
  proname: string;
  args_def: string;
  arg: string;
};

export default class PgClient implements ServerInterface {
  constructor(model: ConnectionModelType, database?: string) {
    this.model = model;
    this.pool = new Pool({
      host: model.address,
      port: model.port,
      password: model.password,
      user: model.username,
      database: database ?? 'React',
    });
  }

  pool: Pool;

  model: ConnectionModelType;

  public async verify(): Promise<boolean> {
    let client;
    try {
      client = await this.pool.connect();
    } catch {
      log.warn('Error connecting to database');
      return false;
    }
    client.release();
    return true;
  }

  public async importTestDataTable(file: string, table: string): Promise<void> {
    const client = await this.pool.connect();
    const stream = client.query(
      copyFrom(`COPY ${table} FROM STDIN DELIMITER ',' CSV HEADER;`)
    );
    const fileStream = fs.createReadStream(file);
    log.error(fileStream);
    fileStream.on('error', (e) => {
      client.release();
      log.error(`FileStream error ${e}`);
    });
    stream.on('error', (e: unknown) => {
      client.release();
      log.error(`Stream error ${e}`);
    });
    stream.on('finish', () => {
      client.release();
      log.error('FileStream finished');
    });
    fileStream.pipe(stream);
  }

  public async getDatabasesQuery(): Promise<unknown> {
    const client = await this.pool.connect();
    const result = await client.query(
      `select datname from pg_catalog.pg_database where datistemplate = false`
    );
    client.release();
    return Promise.all(
      result.rows.map((row: DBQuery) => {
        return row.datname;
      })
    );
  }

  public async fetchProceduresQuery(): Promise<string[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT routine_catalog, routine_name FROM information_schema.routines WHERE routine_type = 'PROCEDURE'`
    );
    client.release();
    return Promise.all(
      result.rows.map((row: DBProcedure) => {
        log.silly(row.routine_name);
        return row.routine_name;
      })
    );
  }

  public async fetchContentQuery(procedure: string): Promise<string[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT prosrc FROM pg_proc WHERE proname = '${procedure}'`
    );
    client.release();
    return result.rows[0].prosrc;
  }

  public async fetchProcedureParametersQuery(
    procedure: string
  ): Promise<ProcedureParameter[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT pronamespace::regnamespace, proname, pg_get_function_arguments(oid) AS args_def, UNNEST(string_to_array(pg_get_function_identity_arguments(oid), ',' )) AS arg FROM pg_proc where proname='${procedure}'`
    );
    client.release();
    return result.rows.map((row: DBParameter) => {
      const parts = row.arg.trim().split(' ');
      return {
        direction: <Direction>parts[0],
        name: parts[1],
        type: parts[2],
      };
    });
  }

  public async callProcedureQuery(procedure: string, parameters: string[]) {
    const client = await this.pool.connect();
    const result = await client.query(
      `CALL ${procedure}(${parameters.join(',')})`
    );
    client.release();
    return result.rows;
  }

  /**
   * Check if a table exists through postgres
   * @param table table to check
   * @returns whether the table exists or not
   */
  public async checkTableExists(table: string) {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT EXISTS (
        SELECT FROM
            pg_tables
        WHERE
            schemaname = 'public' AND
            tablename  = '${table}'
        );`
    );
    return result.rows[0].exists;
  }

  /**
   * Find the number of rows in table through postgres
   * @param table table to check
   * @returns the number of rows in a table if it exists, zero otherwise
   */
  public async numRecordsInTable(table: string) {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT COUNT(*) as count_rows FROM ${table};`
    );
    return result.rows[0].count_rows;
  }

  /**
   * Check if a table has rows where column is exactly value through postgres
   * @param table table to check
   * @param column attribute to check
   * @param value value to compare against
   * @returns list of rows matching condition
   */
  public async checkExact(
    table: string,
    column: string,
    value: string
  ): Promise<unknown[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `select * from ${table} where ${column} = '${value}'`
    );
    client.release();
    return result.rows;
  }

  /**
   * Check if a table has rows where column contains value through postgres
   * @param table table to check
   * @param column attribute to check
   * @param value value to compare against
   * @returns list of rows matching condition
   */
  public async checkContains(
    table: string,
    column: string,
    value: string
  ): Promise<unknown[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `select * from ${table} where ${column} like '${value}'`
    );
    client.release();
    return result.rows;
  }

  /**
   * Looks for a row with a IDs from test table through postgres
   * @param data table with IDS to look for
   * @param table table to check for IDs
   */
  public async checkID(data: string, table: string): Promise<unknown[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT *
      FROM   ${table} target
      WHERE  NOT EXISTS (SELECT 1
                         FROM   ${data} inputTable
                         WHERE  inputTable.ID = target.ID)`
    );
    client.release();
    return result.rows;
  }

  /**
   * Looks for rows where column contains values that compare to a certain value through postgres
   * @param table the table to check
   * @param column attribute to check
   * @param value value to compare against
   * @param comparison whether the fields should be less than/ less than equal to/ greater than/greater than equal to/equal to value
   */
  public async checkNumber(
    table: string,
    column: string,
    value: number,
    comparison: RowNumberOperations
  ): Promise<unknown[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `select * from ${table} where ${column} ${comparison} ${value}`
    );
    client.release();
    return result.rows;
  }

  public async fetchColumnsQuery(tb_name: string): Promise<DBColumn[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tb_name}'`
    );
    client.release();
    return result.rows.map((row: DBColumn) => {
      return {
        column_name: row.column_name,
        data_type: row.data_type,
      };
    });
  }

  public async fetchTablesQuery(): Promise<string[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT tablename FROM pg_tables WHERE schemaname='public'`
    );
    client.release();
    return result.rows.map((row: DBTablename) => {
      return row.tablename;
    });
  }
}
