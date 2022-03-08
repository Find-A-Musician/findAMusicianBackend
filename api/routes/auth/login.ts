import express from 'express';
import bcrypt from 'bcrypt';
import generateToken, { GrantTypes } from '../../auth/generateToken';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';
import { getRepository } from 'typeorm';
import { Musician, Token } from '../../entity';

type Login = operations['login'];

const router = express.Router();

router.post(
  '/',
  async (
    req: Request<{}, getResponsesBody<Login>, getRequestBody<Login>, {}>,
    res: core.Response<getResponsesBody<Login>, {}, getHTTPCode<Login>>,
  ) => {
    const body = req.body;

    const musician = await getRepository(Musician).findOne({
      email: body.email,
    });

    if (!musician) {
      return res.status(400).json({ msg: 'E_UNFOUND_USER' });
    }

    const password = musician.password;
    const userId = musician.id;

    try {
      const result = await bcrypt.compare(body.password, password);

      if (!result) {
        return res.status(401).json({ msg: 'E_INVALID_PASSWORD' });
      }

      const accessToken = generateToken(GrantTypes.AuthorizationCode, userId);

      const refreshToken = generateToken(GrantTypes.RefreshToken, userId);

      const token = new Token();
      token.token = refreshToken;
      token.grandType = 'RefreshToken';
      token.musician = musician;

      await getRepository(Token).save(token);

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
      return res.status(500).json({ msg: 'E_COMPARE_FAILED' });
    }
  },
);

export default router;
