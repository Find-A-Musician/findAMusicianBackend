import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'user',
  password: 'pass',
  database: 'db',
  synchronize: true,
  logging: false,
  entities: ['api/entity/**/*.ts'],
  migrations: ['api/migration/**/*.ts'],
  subscribers: ['api/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'api/entity',
    migrationsDir: 'api/migration',
    subscribersDir: 'api/subscriber',
  },
};

export default config;
