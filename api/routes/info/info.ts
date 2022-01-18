import express from 'express';
import pg from '../../postgres';
import sql from 'sql-template-strings';
import type { operations } from '../../types/schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type core from 'express-serve-static-core';

const router = express.Router();

type Info = operations['getApplicationInfo'];

router.get(
  '/',
  async (
    req: core.Request,
    res: core.Response<getResponsesBody<Info>, {}, getHTTPCode<Info>>,
  ) => {
    try {
      const [
        {
          rows: [{ count: nbMusician }],
        },
        {
          rows: [{ count: nbGroups }],
        },
        {
          rows: [{ count: nbEvents }],
        },
      ] = await Promise.all([
        pg.query(sql`
             SELECT COUNT(email)
             FROM musicians
         `),
        pg.query(sql`
           SELECT COUNT(id)
           FROM groups
       `),
        pg.query(sql`
          SELECT COUNT(id)
          FROM events
      `),
      ]);

      return res.status(200).json({
        nbMusician: parseInt(nbMusician),
        nbGroups: parseInt(nbGroups),
        nbEvents: parseInt(nbEvents),
      });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
