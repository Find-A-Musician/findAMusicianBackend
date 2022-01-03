import express from 'express';
import bcrypt from 'bcrypt';
import sql from 'sql-template-strings';
import pg from '../../postgres';
import { v4 as uuidV4 } from 'uuid';
import generateToken, { GrantTypes } from '../../auth/generateToken';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type Login = operations['login'];

const router = express.Router();

router.post(
  '/',
  async (
    req: Request<{}, getResponsesBody<Login>, getRequestBody<Login>, {}>,
    res: core.Response<getResponsesBody<Login>, {}, getHTTPCode<Login>>,
  ) => {
    const body = req.body;

    const { rows } = await pg.query(
      sql`SELECT id, password 
            FROM musicians 
            WHERE email=${body.email} 
        `,
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'E_UNFOUND_USER' });
    }

    const password = rows[0].password;
    const userId = rows[0].id;

    try {
      const result = await bcrypt.compare(body.password, password);

      if (!result) {
        return res.status(401).json({ msg: 'E_INVALID_PASSWORD' });
      }

      const accessToken = generateToken(GrantTypes.AuthorizationCode, userId);

      const refreshToken = generateToken(GrantTypes.RefreshToken, userId);

      await pg.query(sql`
        INSERT INTO tokens (
          id,
          token,
          musician
        ) VALUES (
          ${uuidV4()},
          ${refreshToken},
          ${userId}
        )
      `);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60,
      });

      const {
        rows: [musicianResponse],
      } = await pg.query(sql`
            SELECT 
            id,
            email,
            given_name as "givenName",
            family_name as "familyName",
            phone,
            facebook_url,
            twitter_url,
            instagram_url,
            promotion,
            location
            FROM musicians
            WHERE musicians.id = ${userId}
        `);

      const { rows: instrumentsResponse } = await pg.query(sql`
        SELECT instruments.*
        FROM instruments
        INNER JOIN musicians_instruments
        ON instruments.id = musicians_instruments.instrument
        WHERE musicians_instruments.musician= ${userId}
    `);

      const { rows: genresResponse } = await pg.query(sql`
        SELECT genres.*
        FROM genres
        INNER JOIN musicians_genres
        ON musicians_genres.genre=genres.id
        WHERE musicians_genres.musician = ${userId}
    `);

      return res.status(200).json({
        token: {
          accessToken,
          refreshToken,
        },
        musician: {
          ...musicianResponse,
          genres: genresResponse,
          instruments: instrumentsResponse,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: 'E_COMPARE_FAILED' });
    }
  },
);

export default router;
