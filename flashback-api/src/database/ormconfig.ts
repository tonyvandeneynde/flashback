import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { migrationFiles } from './migrations';
import { entities } from './entities';

const {
  DB_HOST: host,
  DB_PORT: port,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_DATABASE: database,
  NODE_ENV: environment,
  DB_SSL: isSSLCertEnabled,
  DB_CA_CERT: dbCaCert,
} = process.env;

const isProduction = environment === 'production';
let caCert = undefined;

if (dbCaCert && isSSLCertEnabled) {
  caCert = dbCaCert.replace(/\\n/g, '\n');
}

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: host || '127.0.0.1',
  port: parseInt(port || '0') || 5432,
  username: username,
  password: password,
  database: database,
  ssl: isSSLCertEnabled ? { ca: caCert } : false,
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  dropSchema: false,
  migrationsRun: true,
  logging: ['warn', 'error'],
  logger: isProduction ? 'file' : 'debug',
  migrations: migrationFiles,
  entities: entities,
};

export default new DataSource(connectionOptions);
