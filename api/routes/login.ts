import express, {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import sql from 'sql-template-strings';
import pg from '../postgres';
// import jwt from 'jsonwebtoken';
import type {operations} from '@schema';
import {HttpError} from '@typing';
import jwt from 'jsonwebtoken';

type Login = operations['login'];
type RegisterLogin = Login['requestBody']['content']['application/json'];
type LoginResponse = Login['responses']['200']['content']['application/json'];

const router = express.Router();

router.post(
    '/',
    async (
        req: Request<{}, {}, RegisterLogin, {}>,
        res: Response<LoginResponse | HttpError, {}>,
    ) => {
      const body = req.body;

      const {
        rows,
      } = await pg.query(
          sql`SELECT password 
            FROM musicians 
            WHERE email=${body.email} 
        `,
      );
      if (rows.length===0) {
        res.status(400).json({code: 400, msg: 'E_UNFOUND_USER'});
      }
      const password = rows[0].password;
      bcrypt.compare(body.password, password, function(err, result) {
        if (err) {
          res.status(500).json({code: 500, msg: 'E_COMPARE_FAILED'});
        }
        if (!result) {
          res.status(401).json({code: 400, msg: 'E_INVALID_PASSWORD'});
        }
        const token = jwt.sign(
            {user: body.email},
            process.env.ACCESS_TOKEN_SECRET,
        );
        res.status(200).json({token: token, refresh_token: token});
      });
    },
);

export default router;
