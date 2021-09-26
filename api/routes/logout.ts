import pg from '../postgres';
import sql from 'sql-template-strings';
import { operations } from '@schema';
import { HttpError } from '@typing';
import express, { Request } from 'express';
import * as core from 'express-serve-static-core';

type Logout = operations['logout'];
type code = keyof Logout['responses'];

const router = express.Router();

router.delete(
  '/',
  async (
    req: Request,
    res: core.Response<
      HttpError | Pick<string, never>,
      Pick<string, never>,
      code | number
    >,
  ) => {
    try {
      await pg.query(sql`
            DELETE FROM tokens
            WHERE musician = ${req.userId}
        `);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ code: 500, msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
