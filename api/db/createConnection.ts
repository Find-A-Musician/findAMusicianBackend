import { createConnection as createDbConnection } from 'typeorm';
import config from './config';
import Logger from '../log/logger';

export default async function createConnection(): Promise<void> {
  try {
    await createDbConnection(config);
    Logger.info('💾 Connection to DB successfull');
  } catch (e) {
    Logger.error(`❌ Couldn't connect to the DB\n${e.stack}`);
    throw e;
  }
}
