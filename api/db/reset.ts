import {
  Instrument,
  Genre,
  Musician,
  Groups,
  MusicianGroup,
  Event,
  Notification,
  MembershipNotification,
  GroupKickNotification,
  EventGroupJoin,
  EventDeletedNotification,
  EventGroupKickNotification,
  GroupDeletedNotification,
  // GroupDeletedNotification,
  Invitation,
} from '../entity';
import Logger from '../log/logger';
import { createConnection, getConnection, getRepository } from 'typeorm';
import config from './config';
import { exit } from 'process';

(async function () {
  try {
    await createConnection(config);

    const connection = getConnection();
    // get All the repo
    const insRep = connection.getRepository(Instrument);
    const genRep = connection.getRepository(Genre);
    const musRep = connection.getRepository(Musician);
    const groRep = connection.getRepository(Groups);
    const musGrouRep = connection.getRepository(MusicianGroup);
    const eveRep = connection.getRepository(Event);
    const notRep = connection.getRepository(Notification);
    const invRep = connection.getRepository(Invitation);

    // Reset all the database for the moment
    insRep.query('DELETE FROM instrument');
    genRep.query('DELETE FROM genre');
    musRep.query('DELETE FROM musician');
    groRep.query('DELETE FROM groups');
    musGrouRep.query('DELETE FROM musician_group');
    eveRep.query('DELETE FROM event');
    notRep.query('DELETE FROM notification');
    invRep.query('DELETE FROM invitation');

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
      membership: 'lite_admin',
      instruments: [guitare],
    });

    // const spiritboxMusician3 = musGrouRep.create({
    //   musician: alexandre,
    //   group: spiritbox,
    //   membership: 'lite_admin',
    //   instruments: [piano],
    // });

    const peripheryMusician1 = musGrouRep.create({
      musician: romain,
      group: periphery,
      membership: 'lite_admin',
      instruments: [guitare, piano],
    });

    const peripheryMusician2 = musGrouRep.create({
      musician: dorian,
      group: periphery,
      membership: 'lite_admin',
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
      peripheryMusician1,
      peripheryMusician2,
      slipknotMusician,
      allMusician,
      jazzMusician,
    ]);

    Logger.info('👨‍🎤 group musicians saved');

    const imtTremplin = eveRep.create({
      name: 'IMTremplin',
      description: "Tremplin musical de l'IMT",
      adress: 'Residence Lavoisier',
      groups: [periphery],
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

    const notif1 = getRepository(MembershipNotification).create({
      musician: romain,
      group: spiritbox,
      membership: 'admin',
    });

    const notif2 = getRepository(EventGroupJoin).create({
      event: imtTremplin,
      musician: romain,
      group: spiritbox,
    });

    const notif3 = getRepository(GroupKickNotification).create({
      musician: romain,
      group: spiritbox,
    });

    const notif4 = getRepository(EventDeletedNotification).create({
      name: laPioche.name,
      description: laPioche.description,
      startDate: laPioche.startDate,
      endDate: laPioche.endDate,
      adress: laPioche.adress,
      musician: romain,
      genres: laPioche.genres,
    });

    const notif5 = getRepository(EventGroupKickNotification).create({
      musician: romain,
      group: slipknot,
      event: laPioche,
    });

    const notif6 = getRepository(GroupDeletedNotification).create({
      musician: romain,
      name: slipknot.name,
      description: slipknot.description,
      location: slipknot.location,
      genres: slipknot.genres,
    });

    await getRepository(MembershipNotification).save(notif1);
    await getRepository(EventGroupJoin).save(notif2);
    await getRepository(GroupKickNotification).save(notif3);
    await getRepository(EventDeletedNotification).save(notif4);
    await getRepository(EventGroupKickNotification).save(notif5);
    await getRepository(GroupDeletedNotification).save(notif6);
    Logger.info('📬 Notifications saved');

    const invitation1 = invRep.create({
      type: 'musicianToGroup',
      musician: dorian,
      group: slipknot,
      instruments: [guitare],
      description: "J'aimerais bcp rejoindre slipknot pcq c bien",
    });

    const invitation2 = invRep.create({
      type: 'groupToMusician',
      musician: dorian,
      group: slipknot,
      instruments: [piano],
      invitor: romain,
    });

    const invitation3 = invRep.create({
      type: 'groupToMusician',
      musician: dorian,
      group: allThatRemains,
      instruments: [guitare],
      invitor: romain,
      description: 'Rejoins nous fréro, tu verras c lourd',
    });

    const invitation4 = invRep.create({
      type: 'groupToMusician',
      musician: romain,
      group: jazzGroup,
      instruments: [batterie],
      invitor: dorian,
      description: 'Rejoins nous fréro, tu verras c lourd',
    });

    await invRep.save([invitation1, invitation2, invitation3, invitation4]);
    Logger.info('✉️ invitations saved ');

    exit();
  } catch (err) {
    Logger.info(`❌ Couldn't reset the db data\n ${err.stack}`);
    exit(1);
  }
})();
