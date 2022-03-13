import {
  Instrument,
  Genre,
  Musician,
  Groups,
  MusicianGroup,
  Event,
} from '../entity';
import { getConnection } from 'typeorm';

export default async function reset(): Promise<void> {
  try {
    const connection = getConnection();
    // get All the repo
    const insRep = connection.getRepository(Instrument);
    const genRep = connection.getRepository(Genre);
    const musRep = connection.getRepository(Musician);
    const groRep = connection.getRepository(Groups);
    const musGrouRep = connection.getRepository(MusicianGroup);
    const eveRep = connection.getRepository(Event);

    // Reset all the database for the moment
    insRep.query('DELETE FROM instrument');
    genRep.query('DELETE FROM genre');
    musRep.query('DELETE FROM musician');
    groRep.query('DELETE FROM groups');
    musGrouRep.query('DELETE FROM musician_group');
    eveRep.query('DELETE FROM event');

    console.log('🚮 Reset all the DB tables');

    const metal = genRep.create({ name: 'metal' });
    const rock = genRep.create({ name: 'rock' });
    const jazz = genRep.create({ name: 'jazz' });

    await genRep.save([metal, rock, jazz]);
    console.log('🎵 genres saved');

    const batterie = insRep.create({ name: 'batterie' });
    const guitare = insRep.create({ name: 'guitare' });
    const piano = insRep.create({ name: 'piano' });

    await insRep.save([batterie, guitare, piano]);
    console.log('🎸 instruments saved');

    // mdp : romain123
    const romain = musRep.create({
      email: 'romain.guar91@gmail.com',
      description:
        'Je suis romain guarinoni. Un vrai boute-en-train ! Je code et je fais de la musique. Dans ces 2 domaines je suis très problement bien meilleur que toi désolé fréro le sang.',
      givenName: 'Romain',
      familyName: 'Guarinoni',
      promotion: 'M1',
      location: 'Douai',
      password: '$2b$10$oSkbT5bDabLIuJ5ikcdKT.11kquR8q4MU7sbgo1tFWU67AgnOcppu',
      genres: [rock, metal],
      instruments: [guitare, piano, batterie],
    });

    // mdp : dorian123
    const dorian = musRep.create({
      email: 'dorian.viala@gmail.com',
      givenName: 'Dorian',
      familyName: 'Viala',
      promotion: 'M1',
      location: 'Douai',
      password: '$2b$10$ebn7aGHs7nvFmyg0PIeaU.z0NegP/ikxX9rt7na4nZuJh9NA60BIq',
      genres: [rock, metal],
      instruments: [guitare],
    });

    await musRep.save([romain, dorian]);
    console.log('🧍‍♂️ musicians saved');

    const spiritbox = groRep.create({
      name: 'Spiritbox',
      description: 'vive le prog et le djent',
      genres: [metal],
      location: 'Douai',
    });

    const periphery = groRep.create({
      name: 'periphery',
      description: 'trop trop cool',
      genres: [metal, rock],
      location: 'Lille',
    });

    await groRep.save([spiritbox, periphery]);
    console.log('🎙️ groups saved');

    const spiritboxMusician1 = musGrouRep.create({
      musician: romain,
      group: spiritbox,
      membership: 'admin',
      instruments: [batterie],
    });

    const spiritboxMusician2 = musGrouRep.create({
      musician: dorian,
      group: spiritbox,
      membership: 'member',
      instruments: [guitare],
    });

    const peripheryMusician = musGrouRep.create({
      musician: romain,
      group: periphery,
      membership: 'pending',
      instruments: [guitare, piano],
    });

    await musGrouRep.save([
      spiritboxMusician1,
      spiritboxMusician2,
      peripheryMusician,
    ]);

    console.log('👨‍🎤 group musicians saved');

    const imtTremplin = eveRep.create({
      name: 'IMTremplin',
      description: "Tremplin musical de l'IMT",
      adress: 'Residence Lavoisier',
      groups: [periphery, spiritbox],
      genres: [metal, rock, jazz],
      admins: [romain],
      startDate: new Date('2022-12-01:24:00'),
      endDate: new Date('2022-12-10:24:00'),
    });

    const laPioche = eveRep.create({
      name: 'La Pioche Festival',
      description: "Le festival de l'IMT Nord Europe",
      adress: 'Ville random',
      groups: [periphery, spiritbox],
      genres: [rock],
      admins: [romain, dorian],
      startDate: new Date('2022-12-01:24:00'),
      endDate: new Date('2022-12-10:24:00'),
    });

    await eveRep.save([imtTremplin, laPioche]);

    console.log('🎫 events saved');
  } catch (err) {
    console.log("❌ Couldn't reset the db data", err);
    throw err;
  }
}
