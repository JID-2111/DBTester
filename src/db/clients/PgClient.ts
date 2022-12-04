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
  parameter_mode: string;
  parameter_name: string;
  data_type: string;
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
      ssl: model.ssl,
    });
  }

  pool: Pool;

  model: ConnectionModelType;

  public async verify(): Promise<boolean> {
    let client;
    try {
      client = await this.pool.connect();

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      log.warn(e.message);
      throw new Error(e.message);
    }
    client.release();
    return true;
  }

  public async importTestDataTable(file: string, table: string): Promise<void> {
    const client = await this.pool.connect();
    await client.query(`DELETE FROM ${table}`);
    const stream = await client.query(
      copyFrom(`COPY ${table} FROM STDIN DELIMITER ',' CSV HEADER;`)
    );
    const fileStream = fs.createReadStream(file);
    log.error(fileStream);
    fileStream.on('error', (e) => {
      client.release();
      log.error(`FileStream error ${e}`);
      throw new Error(`FileStream error ${e}`);
    });
    stream.on('error', (e: unknown) => {
      client.release();
      log.error(`Stream error ${e}`);
      throw new Error(`Stream error ${e}`);
    });
    stream.on('finish', () => {
      client.release();
      log.error('FileStream finished');
    });
    await fileStream.pipe(stream);
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

  public async fetchContentQuery(procedure: string): Promise<string> {
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
      `SELECT proc.specific_schema as procedure_schema,
       proc.specific_name,
       proc.routine_name as procedure_name,
       args.parameter_name,
       args.parameter_mode,
       args.data_type
       from information_schema.routines proc
       left join information_schema.parameters args
          on proc.specific_schema = args.specific_schema
          and proc.specific_name = args.specific_name
        where proc.routine_schema not in ('pg_catalog', 'information_schema')
        and proc.routine_type = 'PROCEDURE'
        and proc.routine_name='${procedure}'
        order by procedure_schema,
         specific_name,
         procedure_name,
         args.ordinal_position`
    );
    client.release();
    return result.rows.map((row: DBParameter) => {
      return {
        direction: <Direction>row.parameter_mode,
        name: row.parameter_name,
        type: row.data_type,
      };
    });
  }

  public async callProcedureQuery(procedure: string, parameters: string[]) {
    const client = await this.pool.connect();
    for (let i = 0; i < parameters.length; i += 1) {
      if (
        Number.isNaN(parameters[i]) ||
        Number.isNaN(parseFloat(parameters[i]))
      ) {
        parameters[i] = `'${parameters[i]}'`;
      }
    }
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

  private async getTablePrimaryKey(table: string) {
    const client = await this.pool.connect();
    const result = await client.query(
      `select C.COLUMN_NAME FROM
      INFORMATION_SCHEMA.TABLE_CONSTRAINTS T
      JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE C
      ON C.CONSTRAINT_NAME=T.CONSTRAINT_NAME
      WHERE
      C.TABLE_NAME='${table.toLowerCase()}'
      and T.CONSTRAINT_TYPE='PRIMARY KEY'`
    );
    client.release();
    return result.rows[0].column_name;
  }

  private async deleteFromTableQuery(idTable: string, target: string) {
    const client = await this.pool.connect();
    const idTablePrimaryKey = await this.getTablePrimaryKey(idTable);
    const targetTablePrimaryKey = await this.getTablePrimaryKey(target);
    await client.query(
      `DELETE FROM ${target} WHERE ${targetTablePrimaryKey} IN (SELECT ${idTablePrimaryKey} FROM ${idTable})`
    );
    client.release();
  }

  public async deleteFromTablesQuery(idTable: string, targets: string[]) {
    const promises = targets.map((target) => {
      return this.deleteFromTableQuery(idTable, target);
    });
    await Promise.all(promises);
  }
}
