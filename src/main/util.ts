/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';
import {
  ConnectionStringParser,
  IConnectionStringParameters,
} from 'connection-string-parser';
import { ConnectionModelType } from '../db/Models';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getDataPath() {
  return process.env.NODE_ENV === 'development' ? '.' : app.getPath('userData');
}

export function parseConnectionString(
  model: ConnectionModelType
): IConnectionStringParameters | null {
  const connectionStringParser = new ConnectionStringParser({
    scheme: model.type.toLocaleLowerCase(),
    hosts: [],
  });

  if (model.connectionConfig.config === 'string')
    return connectionStringParser.parse(
      model.connectionConfig.connectionString
    );
  return null;
}
