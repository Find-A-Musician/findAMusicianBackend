//  documentation for bcrypt : https://www.npmjs.com/package/bcrypt

import bcrypt from 'bcrypt';
import generateToken from '../../auth/generateToken';
import { GrantTypes } from '../../auth/generateToken';
import { Musician, Genre, Instrument, Token } from '../../entity';
import { getRepository } from 'typeorm';
import type { NextFunction, Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';
import type { operations } from '@schema';

type Register = operations['register'];

const register = async (
  req: Request<{}, getResponsesBody<Register>, getRequestBody<Register>, {}>,
  res: core.Response<getResponsesBody<Register>, {}, getHTTPCode<Register>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<Register>, {}, getHTTPCode<Register>>
> => {
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

  try {
    const saltRound = 10;

    const tokenRepository = getRepository(Token);
    const musicianRepository = getRepository(Musician);

    const hash = await bcrypt.hash(password, saltRound);

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
    if (err.code == 23505) {
      return res.status(409).json({ msg: 'E_USER_ALREADY_EXIST' });
    }

    next(err);
  }
};

export { register };
