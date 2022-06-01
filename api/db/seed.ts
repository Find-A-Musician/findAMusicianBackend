import { getConnection } from 'typeorm';
import { Genre } from '../entity';
import createConnection from './createConnection';
import { genreSeeder, groupSeeder, legacySeeder } from './seeder';

async function seed() {
  await createConnection();
  const connection = await getConnection();
  const { romain, instruments } = await legacySeeder(connection);

  const genres: Genre[] = await genreSeeder(connection, 20);
  await groupSeeder(connection, genres, romain, instruments, 100);

  console.log('Done!');
}

seed();

// to run seeder :
// docker exec -it container_id npm run seed
