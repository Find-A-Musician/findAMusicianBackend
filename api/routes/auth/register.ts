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
    const body = req.body;

    const saltRound = 10;
    let hash: string;

    if (await getRepository(Musician).findOne({ email: body.email })) {
      return res.status(401).json({ msg: 'E_USER_ALREADY_EXIST' });
    }
    try {
      hash = await bcrypt.hash(body.password, saltRound);
    } catch (err) {
      return res.status(500).json({
        msg: 'E_HASH_ERROR',
        stack: JSON.stringify(err),
      });
    }

    try {
      const newMusician = new Musician();

      // Save basic info
      newMusician.email = body.email;
      newMusician.givenName = body.givenName;
      newMusician.familyName = body.familyName;
      newMusician.phone = body.phone;
      newMusician.facebookUrl = body.facebookUrl;
      newMusician.instagramUrl = body.instagramUrl;
      newMusician.twitterUrl = body.twitterUrl;
      newMusician.password = hash;
      newMusician.location = body.location;
      newMusician.promotion = body.promotion;

      // Get all the genres of the req
      const newMusicianGenres: Genre[] = [];
      for (let i = 0; i < body.genres.length; i++) {
        newMusicianGenres.push(
          await getRepository(Genre).findOne({ name: body.genres[i].name }),
        );
      }

      // Get all the instruments of the req
      const newMusicianInstruments: Instrument[] = [];
      for (let i = 0; i < body.genres.length; i++) {
        newMusicianInstruments.push(
          await getRepository(Instrument).findOne({
            name: body.instruments[i].name,
          }),
        );
      }

      newMusician.genres = newMusicianGenres;
      newMusician.instruments = newMusicianInstruments;

      const { id: userId } = await getRepository(Musician).save(newMusician);

      const accessToken = generateToken(GrantTypes.AuthorizationCode, userId);

      const refreshToken = generateToken(GrantTypes.RefreshToken, userId);

      const token = new Token();
      token.token = refreshToken;
      token.grandType = 'RefreshToken';
      token.musician = newMusician;

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
