//  documentation for bcrypt : https://www.npmjs.com/package/bcrypt

import express, { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import type { operations } from '@schema';
import { HttpError } from 'api/types/typing';
import sql from 'sql-template-strings';
import pg from '../postgres';
import jwt from 'jsonwebtoken';

type Register = operations['register'];
type RegisterBody = Register['requestBody']['content']['application/json'];
type RegisterResponse =
  Register['responses']['201']['content']['application/json'];
const router = express.Router();

router.post(
  '/',
  async (
    req: Request<
      Pick<string, never>,
      Pick<string, never>,
      RegisterBody,
      Pick<string, never>
    >,
    res: Response<RegisterResponse | HttpError, Pick<string, never>>,
  ) => {
    const body = req.body;

    const saltRound = 10;
    bcrypt.hash(body.password, saltRound, async function (err, hash) {
      if (err) {
        res.status(500).json({
          code: 500,
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

        const accessToken = jwt.sign(
          {
            userId: userId,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' },
        );

        const refreshToken = jwt.sign(
          {
            userId: userId,
          },
          process.env.REFRESH_TOKEN_SECRET,
        );

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

        res.status(201).json({
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
        console.log(err);
        res.status(400).json({
          code: 400,
          msg: 'E_SQL_ERROR',
          stack: JSON.stringify(err),
        });
      }
    });
  },
);

export default router;
