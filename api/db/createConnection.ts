import { createConnection as createDbConnection } from 'typeorm';

export default async function createConnection(): Promise<void> {
  try {
    await createDbConnection();
  } catch (e) {
    console.log("❌ Couldn't connect to the DB", e);
    throw e;
  }
}
