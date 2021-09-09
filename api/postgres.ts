import {Pool} from 'pg';

const pg = new Pool({
  user: 'user',
  host: 'postgres',
  database: 'db',
  password: 'pass',
  port: 5432,
});

export default pg;
