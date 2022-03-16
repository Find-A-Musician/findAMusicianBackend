import { Connection } from 'typeorm';
import { Groups, Genre } from '../../entity';
import { faker } from '@faker-js/faker';

export type Location = 'Douai' | 'Lille';

export async function genreSeeder(
  connection: Connection,
  amount = 10,
): Promise<Groups[]> {
  const res = [];
  const repository = connection.getRepository(Genre);
  const seenGenres = [];
  for (let i = 0; i < amount; i++) {
    const newGenre = faker.music.genre();
    if (seenGenres.includes(newGenre)) continue;
    else {
      seenGenres.push(newGenre);
      const genre = repository.create({
        name: newGenre,
      });
      res.push(genre);
      await genre.save();
    }
  }
  console.log(`saved ${amount} genres`);
  return res;
}

export default genreSeeder;
