//  documentation for bcrypt : https://www.npmjs.com/package/bcrypt

import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import sql from 'sql-template-strings';
import pg from '../postgres';
import generateToken from '../auth/generateToken';
import { GrantTypes } from '../auth/generateToken';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';
import type { operations } from '@schema';

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
    bcrypt.hash(body.password, saltRound, async function (err, hash) {
      if (err) {
        return res.status(500).json({
          msg: 'E_HASH_ERROR',
          stack: JSON.stringify(err),
        });
      }
      const userId = uuidV4();
      try {
        await pg.query(
          sql`INSERT INTO musicians (
          id,
          email,
          given_name,
          family_name,
          phone,
          facebook_url,
          twitter_url,
          instagram_url,
          promotion,
          password,
          location
        ) VALUES (
          ${userId},
          ${body.musician.email},
          ${body.musician.givenName},
          ${body.musician.familyName},
          ${body.musician.phone || null},
          ${body.musician.facebookUrl || null},
          ${body.musician.twitterUrl || null},
          ${body.musician.instagramUrl || null},
          ${body.musician.promotion},
          ${hash},
          ${body.musician.location}
        )
        `,
        );
        for (let i = 0; i < body.genres.length; i++) {
          await pg.query(sql`
              INSERT INTO musicians_genres (
                musician,
                genre
              ) VALUES  (
                ${userId},
                ${body.genres[i].id}
              )

            `);
        }
        for (let i = 0; i < body.instruments.length; i++) {
          await pg.query(sql`
              INSERT INTO musicians_instruments (
                musician,
                instrument
              ) VALUES  (
                ${userId},
                ${body.instruments[i].id}
              )

            `);
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

        return res.status(201).json({
          token: {
            accessToken,
            refreshToken,
          },
          musician: {
            id: userId,
            email: body.musician.email,
            givenName: body.musician.givenName,
            familyName: body.musician.familyName,
            phone: body.musician.phone,
            facebookUrl: body.musician.facebookUrl,
            instagramUrl: body.musician.instagramUrl,
            twitterUrl: body.musician.twitterUrl,
            promotion: body.musician.promotion,
            location: body.musician.location,
          },
          genres: body.genres,
          instruments: body.instruments,
        });
      } catch (err) {
        return res.status(500).json({
          msg: 'E_SQL_ERROR',
          stack: JSON.stringify(err),
        });
      }
    });
  },
);

export default router;
