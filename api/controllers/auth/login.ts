import bcrypt from 'bcrypt';
import generateToken, { GrantTypes } from '../../auth/generateToken';
import { getRepository } from 'typeorm';
import { Musician, Token } from '../../entity';
import type { operations } from '@schema';
import type { NextFunction, Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type Login = operations['login'];

const login = async (
  req: Request<{}, getResponsesBody<Login>, getRequestBody<Login>, {}>,
  res: core.Response<getResponsesBody<Login>, {}, getHTTPCode<Login>>,
  next: NextFunction,
): Promise<core.Response<getResponsesBody<Login>, {}, getHTTPCode<Login>>> => {
  try {
    const body = req.body;

    const tokenRepository = getRepository(Token);

    const musician = await getRepository(Musician).findOne({
      email: body.email,
    });

    if (!musician) {
      return res.status(400).json({ msg: 'E_UNFOUND_USER' });
    }

    const password = musician.password;
    const userId = musician.id;

    const result = await bcrypt.compare(body.password, password);

    if (!result) {
      return res.status(401).json({ msg: 'E_INVALID_PASSWORD' });
    }

    const accessToken = generateToken(GrantTypes.AuthorizationCode, userId);

    const refreshToken = generateToken(GrantTypes.RefreshToken, userId);

    const token = tokenRepository.create({
      token: refreshToken,
      grandType: 'RefreshToken',
      musician,
    });

    await tokenRepository.save(token);

    const musicianInfo = await getRepository(Musician).findOne({
      where: { id: userId },
      relations: ['instruments', 'genres'],
    });

    return res.status(200).json({
      token: {
        accessToken,
        refreshToken,
      },
      musician: musicianInfo,
    });
  } catch (err) {
    next(err);
  }
};

export { login };
