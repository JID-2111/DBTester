/* eslint import/prefer-default-export: off */
import { ConnectionModelType } from 'db/models/ConnectionModels';

export function formatConnectionString(connection: ConnectionModelType) {
  const connectionString =
    `${connection.type}://${connection.username}:` +
    `****` +
    `@${connection.address}:${connection.port}`;

  return connectionString;
}
