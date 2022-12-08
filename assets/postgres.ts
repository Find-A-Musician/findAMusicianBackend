import { Pool } from 'pg';

const pg = new Pool({
  user: process.env.PGUSER,
  host: 'postgres',
  database: 'db',
  password: process.env.PGPASSWORD,
  port: 5432,
});

export default pg;
