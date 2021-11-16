import express from 'express';
import bcrypt from 'bcrypt';
import sql from 'sql-template-strings';
import pg from '../postgres';
import { v4 as uuidV4 } from 'uuid';
import generateToken, { GrantTypes } from '../auth/generateToken';
import cookie from 'cookie';
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
      sql`SELECT * 
            FROM musicians 
            WHERE email=${body.email} 
        `,
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'E_UNFOUND_USER' });
    }

    const password = rows[0].password;

    try {
      const result = await bcrypt.compare(body.password, password);

      if (!result) {
        return res.status(401).json({ msg: 'E_INVALID_PASSWORD' });
      }

      const accessToken = generateToken(
        GrantTypes.AuthorizationCode,
        rows[0].id,
      );

      const refreshToken = generateToken(GrantTypes.RefreshToken, rows[0].id);

      await pg.query(sql`
        INSERT INTO tokens (
          id,
          token,
          musician
        ) VALUES (
          ${uuidV4()},
          ${refreshToken},
          ${rows[0].id}
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

      return res.status(200).json({
        token: {
          accessToken,
          refreshToken,
        },
        musician: rows[0],
      });
    } catch (err) {
      return res.status(500).json({ msg: 'E_COMPARE_FAILED' });
    }
  },
);

export default router;
