import { Connection } from 'typeorm';
import {
  Groups,
  Genre,
  Musician,
  Instrument,
  MusicianGroup,
} from '../../entity';
import { faker } from '@faker-js/faker';

export type Location = 'Douai' | 'Lille';

export async function groupSeeder(
  connection: Connection,
  genres: Genre[],
  musician: Musician,
  instruments: Instrument[],
  amount = 10,
): Promise<Groups[]> {
  const res = [];
  const repository = connection.getRepository(Groups);
  const musGrouRep = connection.getRepository(MusicianGroup);
  for (let i = 0; i < amount; i++) {
    const group = repository.create({
      name: faker.name.findName(),
      description: faker.lorem.paragraph(),
      genres: faker.random.arrayElements(genres),
      location: faker.random.arrayElement(['Douai', 'Lille'] as Location[]),
    });

    res.push(group);
    await group.save();

    const newMusGroup = musGrouRep.create({
      musician: musician,
      group: group,
      membership: 'admin',
      instruments: faker.random.arrayElements(instruments),
    });

    await musGrouRep.save(newMusGroup);
  }
  console.log(`saved ${amount} groups`);
  return res;
}

export default groupSeeder;
