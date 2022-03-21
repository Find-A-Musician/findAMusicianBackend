import {
  Instrument,
  Genre,
  Musician,
  Groups,
  MusicianGroup,
  Event,
} from '../entity';
import Logger from '../log/logger';
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

    Logger.info('🚮 Reset all the DB tables');

    const metal = genRep.create({ name: 'metal' });
    const rock = genRep.create({ name: 'rock' });
    const jazz = genRep.create({ name: 'jazz' });

    await genRep.save([metal, rock, jazz]);
    Logger.info('🎵 genres saved');

    const batterie = insRep.create({ name: 'batterie' });
    const guitare = insRep.create({ name: 'guitare' });
    const piano = insRep.create({ name: 'piano' });

    await insRep.save([batterie, guitare, piano]);
    Logger.info('🎸 instruments saved');

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

    // mdp : alexandre123
    const alexandre = musRep.create({
      email: 'alexandre.lam@gmail.com',
      givenName: 'Alexandre',
      familyName: 'Lam',
      promotion: 'M1',
      location: 'Douai',
      password: '$2b$10$I9uuTF2Qt.53VJrXtg13teq14vKqGCp0uSIfLUqtskpsLjoqBhM4K',
      genres: [jazz],
      instruments: [piano],
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

    await musRep.save([romain, dorian, alexandre]);
    Logger.info('🧍‍♂️ musicians saved');

    const spiritbox = groRep.create({
      name: 'Spiritbox',
      description: 'vive le prog et le djent',
      genres: [metal],
      location: 'Douai',
    });

    const periphery = groRep.create({
      name: 'Periphery',
      description: 'trop trop cool',
      genres: [metal, rock],
      location: 'Lille',
    });

    const slipknot = groRep.create({
      name: 'Slipknot',
      description: 'Du metak bien enervé',
      genres: [metal],
      location: 'Douai',
    });

    const allThatRemains = groRep.create({
      name: 'All that Remains',
      description: "metal core à l'ancienne",
      genres: [metal],
      location: 'Lille',
    });

    const jazzGroup = groRep.create({
      name: 'jazz band',
      description: 'du jazz',
      genres: [jazz],
      location: 'Douai',
    });

    await groRep.save([
      spiritbox,
      periphery,
      slipknot,
      allThatRemains,
      jazzGroup,
    ]);
    Logger.info('🎙️ groups saved');

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

    const spiritboxMusician3 = musGrouRep.create({
      musician: alexandre,
      group: spiritbox,
      membership: 'lite_admin',
      instruments: [piano],
    });

    const peripheryMusician = musGrouRep.create({
      musician: romain,
      group: periphery,
      membership: 'pending',
      instruments: [guitare, piano],
    });

    const slipknotMusician = musGrouRep.create({
      musician: romain,
      group: slipknot,
      membership: 'member',
      instruments: [guitare],
    });

    const allMusician = musGrouRep.create({
      musician: romain,
      group: allThatRemains,
      membership: 'member',
      instruments: [guitare],
    });

    const jazzMusician = musGrouRep.create({
      musician: dorian,
      group: jazzGroup,
      membership: 'member',
      instruments: [guitare],
    });

    await musGrouRep.save([
      spiritboxMusician1,
      spiritboxMusician2,
      spiritboxMusician3,
      peripheryMusician,
      slipknotMusician,
      allMusician,
      jazzMusician,
    ]);

    Logger.info('👨‍🎤 group musicians saved');

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

    Logger.info('🎫 events saved');
  } catch (err) {
    Logger.info("❌ Couldn't reset the db data", err);
    throw err;
  }
}
