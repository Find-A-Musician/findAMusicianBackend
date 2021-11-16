import query from '../postgres';
import sql from 'sql-template-strings';
import express from 'express';
import jwt from 'jsonwebtoken';
import type { operations } from '@schema';
import { Request } from 'express';
import generateToken, { GrantTypes } from '../auth/generateToken';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type AuthTokenResult = {
  userId: string;
  grantType: GrantTypes;
};

type PostToken = operations['postRefreshToken'];

const router = express.Router();

router.post(
  '/',
  async (
    req: Request<
      {},
      getResponsesBody<PostToken>,
      getRequestBody<PostToken>,
      {}
    >,
    res: core.Response<getResponsesBody<PostToken>, {}, getHTTPCode<PostToken>>,
  ) => {
    try {
      const { rows } = await query(sql`
        SELECT * FROM tokens
        WHERE token=${req.body.refreshToken}
    `);
      if (rows.length === 0) {
        return res.status(401).json({ msg: 'E_INVALID_REFRESH_TOKEN' });
      }

      jwt.verify(
        req.body.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, result: AuthTokenResult) => {
          if (err || result.grantType !== GrantTypes.RefreshToken) {
            return res.status(401).json({ msg: 'E_INVALID_REFRESH_TOKEN' });
          }
          const accessToken = generateToken(
            GrantTypes.AuthorizationCode,
            result.userId,
          );

          return res.status(200).json({ accessToken });
        },
      );
    } catch (err) {
      return res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
