import {
  Instrument,
  Genre,
  Musician,
  Band,
  MusicianBand,
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
    const banRep = connection.getRepository(Band);
    const musBanRep = connection.getRepository(MusicianBand);
    const eveRep = connection.getRepository(Event);

    // Reset all the database for the moment
    insRep.query('DELETE FROM instrument');
    genRep.query('DELETE FROM genre');
    musRep.query('DELETE FROM musician');
    banRep.query('DELETE FROM band');
    musBanRep.query('DELETE FROM musician_band');
    eveRep.query('DELETE FROM event');

    console.log('🚮 Reset all the DB tables');

    const metal = new Genre();
    metal.name = 'metal';
    const rock = new Genre();
    rock.name = 'rock';
    const jazz = new Genre();
    jazz.name = 'jazz';

    await genRep.save([metal, rock, jazz]);
    console.log('🎵 genres saved');

    const batterie = new Instrument();
    batterie.name = 'batterie';
    const guitare = new Instrument();
    guitare.name = 'guitare';
    const piano = new Instrument();
    piano.name = 'piano';

    await insRep.save([batterie, guitare, piano]);
    console.log('🎸 instruments saved');

    const romain = new Musician();
    romain.email = 'romain.guar91@gmail.com';
    romain.givenName = 'Romain';
    romain.familyName = 'Guarinoni';
    romain.promotion = 'M1';
    romain.location = 'Douai';
    // romain123
    romain.password =
      '$2b$10$oSkbT5bDabLIuJ5ikcdKT.11kquR8q4MU7sbgo1tFWU67AgnOcppu';
    romain.genres = [rock, metal];
    romain.instruments = [guitare, piano, batterie];

    const dorian = new Musician();
    dorian.email = 'dorian.viala@gmail.com';
    dorian.givenName = 'Dorion';
    dorian.familyName = 'Viala';
    dorian.promotion = 'M1';
    dorian.location = 'Douai';
    // dorian123
    dorian.password =
      '$2b$10$ebn7aGHs7nvFmyg0PIeaU.z0NegP/ikxX9rt7na4nZuJh9NA60BIq';
    dorian.genres = [rock, metal];
    dorian.instruments = [guitare];

    await musRep.save([romain, dorian]);
    console.log('🧍‍♂️ musicians saved');

    const spiritbox = new Band();
    spiritbox.name = 'Spiritbox';
    spiritbox.description = 'vive le prog et le djent';
    spiritbox.genres = [metal];
    spiritbox.location = 'Douai';

    const periphery = new Band();
    periphery.name = 'periphery';
    periphery.description = 'trop trop cool';
    periphery.genres = [metal, rock];
    periphery.location = 'Lille';

    await banRep.save([spiritbox, periphery]);
    console.log('🎙️ groups saved');

    const spiritboxMusician1 = new MusicianBand();
    spiritboxMusician1.musician = romain;
    spiritboxMusician1.group = spiritbox;
    spiritboxMusician1.membership = 'admin';
    spiritboxMusician1.instruments = [batterie];

    const spiritboxMusician2 = new MusicianBand();
    spiritboxMusician2.musician = dorian;
    spiritboxMusician2.group = spiritbox;
    spiritboxMusician2.membership = 'member';
    spiritboxMusician2.instruments = [guitare];

    const peripheryMusician = new MusicianBand();
    peripheryMusician.musician = romain;
    peripheryMusician.group = periphery;
    peripheryMusician.membership = 'pending';
    peripheryMusician.instruments = [guitare, piano];

    await musBanRep.save([
      spiritboxMusician1,
      spiritboxMusician2,
      peripheryMusician,
    ]);

    console.log('👨‍🎤 group musicians saved');

    const imtTremplin = new Event();
    imtTremplin.name = 'IMTremplin';
    imtTremplin.description = "Tremplin musical de l'IMT";
    imtTremplin.adress = 'Residence Lavoisier';
    imtTremplin.groups = [periphery, spiritbox];
    imtTremplin.genres = [metal, rock, jazz];
    imtTremplin.admins = [romain];
    imtTremplin.startDate = new Date('2022-12-01:24:00');
    imtTremplin.endDate = new Date('2022-12-10:24:00');

    const laPioche = new Event();
    laPioche.name = 'La Pioche Festival';
    laPioche.description = "Le festival de l'IMT Nord Europe";
    laPioche.adress = 'Villle random';
    laPioche.groups = [periphery, spiritbox];
    laPioche.genres = [rock];
    laPioche.admins = [romain, dorian];
    laPioche.startDate = new Date('2022-12-01:24:00');
    laPioche.endDate = new Date('2022-12-10:24:00');

    await eveRep.save([imtTremplin, laPioche]);

    console.log('🎫 events saved');
  } catch (err) {
    console.log("❌ Couldn't reset the db data", err);
    throw err;
  }
}
