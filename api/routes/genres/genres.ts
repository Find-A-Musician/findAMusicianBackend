import express from 'express';
import pg from '../../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type core from 'express-serve-static-core';

const router = express.Router();

type GetGenres = operations['getGenres'];

router.get(
  '/',
  async (
    req: core.Request,
    res: core.Response<getResponsesBody<GetGenres>, {}, getHTTPCode<GetGenres>>,
  ) => {
    try {
      const { rows } = await pg.query(sql`
        SELECT * FROM genres
    `);
      return res.status(200).json(rows);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
