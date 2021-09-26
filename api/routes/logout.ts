import pg from '../postgres';
import sql from 'sql-template-strings';
import express from 'express';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';

type Logout = operations['logout'];

const router = express.Router();

router.delete(
  '/',
  async (
    req: Request,
    res: core.Response<
      getResponsesBody<Logout>,
      Pick<string, never>,
      getHTTPCode<Logout>
    >,
  ) => {
    try {
      await pg.query(sql`
            DELETE FROM tokens
            WHERE musician = ${req.userId}
        `);
      res.status(200).json('the user has been logout');
    } catch (err) {
      res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
