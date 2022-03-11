//  documentation for bcrypt : https://www.npmjs.com/package/bcrypt

import express from 'express';
import bcrypt from 'bcrypt';
import generateToken from '../../auth/generateToken';
import { GrantTypes } from '../../auth/generateToken';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';
import type { operations } from '@schema';
import { Musician, Genre, Instrument, Token } from '../../entity';
import { getRepository } from 'typeorm';

type Register = operations['register'];

const router = express.Router();

router.post(
  '/',
  async (
    req: Request<{}, getResponsesBody<Register>, getRequestBody<Register>, {}>,
    res: core.Response<getResponsesBody<Register>, {}, getHTTPCode<Register>>,
  ) => {
    const {
      email,
      givenName,
      familyName,
      phone,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      password,
      location,
      promotion,
      genres,
      instruments,
    } = req.body;

    const saltRound = 10;
    let hash: string;

    const tokenRepository = getRepository(Token);
    const musicianRepository = getRepository(Musician);

    if (await getRepository(Musician).findOne({ email: email })) {
      return res.status(401).json({ msg: 'E_USER_ALREADY_EXIST' });
    }

    try {
      hash = await bcrypt.hash(password, saltRound);
    } catch (err) {
      return res.status(500).json({
        msg: 'E_HASH_ERROR',
        stack: JSON.stringify(err),
      });
    }

    try {
      // Get all the genres of the req
      const newMusicianGenres: Genre[] = [];
      for (let i = 0; i < genres.length; i++) {
        newMusicianGenres.push(
          await getRepository(Genre).findOne({ name: genres[i].name }),
        );
      }

      // Get all the instruments of the req
      const newMusicianInstruments: Instrument[] = [];
      for (let i = 0; i < instruments.length; i++) {
        newMusicianInstruments.push(
          await getRepository(Instrument).findOne({
            name: instruments[i].name,
          }),
        );
      }

      const newMusician = musicianRepository.create({
        email,
        givenName,
        familyName,
        phone,
        facebookUrl,
        instagramUrl,
        twitterUrl,
        password: hash,
        location,
        promotion,
        genres: newMusicianGenres,
        instruments: newMusicianInstruments,
      });

      const { id: userId } = await musicianRepository.save(newMusician);

      const accessToken = generateToken(GrantTypes.AuthorizationCode, userId);

      const refreshToken = generateToken(GrantTypes.RefreshToken, userId);

      const token = tokenRepository.create({
        token: refreshToken,
        grandType: 'RefreshToken',
        musician: newMusician,
      });

      await getRepository(Token).save(token);

      return res.status(201).json({
        token: {
          accessToken,
          refreshToken,
        },
        musician: newMusician,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'E_SQL_ERROR',
        stack: JSON.stringify(err),
      });
    }
  },
);

export default router;
