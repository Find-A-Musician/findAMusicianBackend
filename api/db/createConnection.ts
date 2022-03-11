import { createConnection as createDbConnection } from 'typeorm';
import config from './config';

export default async function createConnection(): Promise<void> {
  try {
    await createDbConnection(config);
    console.log('💾 Connection to DB successfull');
  } catch (e) {
    console.log("❌ Couldn't connect to the DB", e);
    throw e;
  }
}
