import pg from '../postgres';
import sql from 'sql-template-strings';
import {operations} from '@schema';
import express, {Request, Response} from 'express';
import {HttpError} from 'api/types/typing';
import jwt from 'jsonwebtoken';

type PostToken = operations['postRefreshToken'];
type PostTokenBody = PostToken['requestBody']['content']['application/json'];
type PostTokenResponse =
  PostToken['responses']['200']['content']['application/json'];

const router = express.Router();

router.post(
    '/',
    async (
        req: Request<{}, {}, PostTokenBody, {}>,
        res: Response<PostTokenResponse | HttpError, {}>,
    ) => {
      try {
        const {rows} = await pg.query(sql`
        SELECT * FROM tokens
        WHERE token=${req.body.refreshToken}
    `);
        if (rows.length === 0) {
          res.status(401).json({code: 401, msg: 'E_INVALID_REFRESH_TOKEN'});
        }

        jwt.verify(
            req.body.refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, result) => {
              if (err) {
                res.status(401)
                    .json({code: 401, msg: 'E_INVALID_REFRESH_TOKEN'});
              }
              const accessToken = jwt.sign(
                  {userId: result.userId},
                  process.env.ACCESS_TOKEN_SECRET,
                  {expiresIn: '1h'},
              );

              res.status(200).json({accessToken});
            },
        );

        res.status(200).json({accessToken: 'copucou'});
      } catch (err) {
        res.status(500).json({code: 500, msg: 'E_SQL_ERROR', stack: err});
      }
    },
);

export default router;
