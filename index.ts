import 'reflect-metadata';
import express from 'express';
import generateType from './api/command/generateType';
import server from './api/server/server';
import http from 'http';
import createConnection from './api/db/createConnection';

import {
  Genre,
  Musician,
  Instrument,
  Location,
  Promotion,
  Band,
  MusicianBand,
  Membership,
  // MusicianBand,
} from './api/entity';
import { getRepository } from 'typeorm';

const PORT = process.env.PORT || 8000;
const httpApp = new http.Server(server);

if (process.env.NODE_ENV === 'production') {
  // Static folder
  server.use(express.static(__dirname + '/public/'));

  // Handle SPA
  server.get(/.*/, (req, res) =>
    res.sendFile(__dirname + '/public/index.html'),
  );
}

httpApp.listen(PORT, async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await generateType();
      console.log(
        '📕 Swager documention : http://localhost:' + PORT + '/api-docs',
      );
    } catch (err) {
      console.log(err);
      throw new Error('E_TYPES_FAILED');
    }

    await createConnection();

    console.log('💾 Connection to DB successfull');

    const insRep = getRepository(Instrument);
    const genRep = getRepository(Genre);
    const musRep = getRepository(Musician);
    const banRep = getRepository(Band);
    const musBanRep = getRepository(MusicianBand);

    // Reset all the database for the moment, later we will use migration
    insRep.query('DELETE FROM instrument');
    genRep.query('DELETE FROM genre');
    musRep.query('DELETE FROM musician');
    banRep.query('DELETE FROM band');
    musBanRep.query('DELETE FROM musician_band');

    const metal = new Genre();
    metal.name = 'metal';
    const rock = new Genre();
    rock.name = 'rock';

    await genRep.save(metal);
    await genRep.save(rock);

    const batterie = new Instrument();
    batterie.name = 'batterie';
    const guitare = new Instrument();
    guitare.name = 'guitare';

    await insRep.save(batterie);
    await insRep.save(guitare);

    const musician = new Musician();
    musician.email = 'romain.guar91@gmail.com';
    musician.givenName = 'Romain';
    musician.familyName = 'Guarinoni';
    musician.promotion = Promotion.M1;
    musician.location = Location.Douai;
    musician.password = 'coucou';
    musician.genres = [rock, metal];

    await musRep.save(musician);

    const spiritbox = new Band();
    spiritbox.name = 'Spiritbox';
    spiritbox.description = 'vive le prog et le djent';
    spiritbox.genres = [metal];
    const periphery = new Band();
    periphery.name = 'periphery';
    periphery.description = 'trop trop cool';
    periphery.genres = [metal, rock];

    await banRep.save(spiritbox);
    await banRep.save(periphery);

    const musGroup1 = new MusicianBand();
    musGroup1.musician = musician;
    musGroup1.group = spiritbox;
    musGroup1.membership = Membership.Admin;
    musGroup1.instruments = [batterie, guitare];
    const musGroup2 = new MusicianBand();
    musGroup2.musician = musician;
    musGroup2.group = periphery;
    musGroup2.membership = Membership.Member;
    musGroup2.instruments = [guitare];

    await musBanRep.save(musGroup1);
    await musBanRep.save(musGroup2);

    // get all info on romain musician
    const romain = await musRep.findOne({
      where: { email: 'romain.guar91@gmail.com' },
      relations: ['genres', 'musicianGroups'],
    });

    // Get all the groups where tu musician is romain
    const groups = (await musBanRep.find({ musician: romain })).map(
      (musBand) => musBand.group,
    );

    // const metalF = await genRep.findOne({
    //   where: { name: 'metal' },
    //   relations: ['musicians'],
    // });

    // console.log(romain.genres);
    // console.log(romain.musicianGroups);

    console.log(groups);
    // console.log(metalF.musicians);
  }

  console.log(' 🔌 Listening on port : http://localhost:' + PORT);
});
