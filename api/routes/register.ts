//  documentation for bcrypt : https://www.npmjs.com/package/bcrypt

import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import sql from 'sql-template-strings';
import query from '../postgres';
import cookie from 'cookie';
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

    try {
      const hash = await bcrypt.hash(body.password, saltRound);
      const userId = uuidV4();
      try {
        await query(
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
          ${body.musician.facebook_url || null},
          ${body.musician.twitter_url || null},
          ${body.musician.instagram_url || null},
          ${body.musician.promotion},
          ${hash},
          ${body.musician.location}
        )
        `,
        );
        for (let i = 0; i < body.genres.length; i++) {
          await query(sql`
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
          await query(sql`
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

        await query(sql`
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

        res.setHeader(
          'Set-Cookie',
          cookie.serialize('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60,
          }),
        );

        res.setHeader(
          'Set-Cookie',
          cookie.serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
          }),
        );

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
            facebook_url: body.musician.facebook_url,
            instagram_url: body.musician.instagram_url,
            twitter_url: body.musician.twitter_url,
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
    } catch (err) {
      return res.status(500).json({
        msg: 'E_HASH_ERROR',
        stack: JSON.stringify(err),
      });
    }
  },
);

export default router;
