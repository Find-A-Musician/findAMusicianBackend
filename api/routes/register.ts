//  documentation for bcrypt : https://www.npmjs.com/package/bcrypt

import express, {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {v4 as uuidV4} from 'uuid';
import type {operations} from '@schema';
import {HttpError} from '@typing';
import sql from 'sql-template-strings';
import pg from '../postgres';
import jwt from 'jsonwebtoken';

type Register = operations['register'];
type RegisterBody = Register['requestBody']['content']['application/json'];
type RegisterResponse =
  Register['responses']['201']['content']['application/json'];
const router = express.Router();

router.post(
    '/', async (
        req: Request<{}, {}, RegisterBody, {}>,
        res: Response<RegisterResponse | HttpError, {}>,
    ) => {
      const body = req.body;

      const saltRound = 10;
      bcrypt.hash(body.password, saltRound, async function(err, hash) {
        if (err) {
          res
              .status(500)
              .json({
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
          ${body.email},
          ${body.givenName},
          ${body.familyName},
          ${body.phone || null},
          ${body.facebookUrl || null},
          ${body.twitterUrl || null},
          ${body.instagramUrl || null},
          ${body.promotion},
          ${hash},
          ${body.location}
        )
        `);
          console.log(process.env.ACCESS_TOKEN_SECRET);
          const token = jwt.sign({
            user: body.email,
          }, process.env.ACCESS_TOKEN_SECRET);

          res.status(201).json({token: token, refresh_token: token});
        } catch (err) {
          console.log(err);
          res
              .status(400)
              .json({
                code: 400,
                msg: 'E_SQL_ERROR',
                stack: JSON.stringify(err),
              });
        }
      });
    },
);


export default router;
