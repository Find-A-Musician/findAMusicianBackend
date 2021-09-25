import express, { Request } from 'express';
import core from 'express-serve-static-core';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import { getCode } from '@typing';

const router = express.Router();

type GetGenres = operations['getGenres'];
type GetGenresResponse = GetGenres['responses'];

type getGenreResponseBody =
  | GetGenresResponse['200']['content']['application/json']
  | GetGenresResponse['500']['content']['application/json'];

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<getGenreResponseBody, {}, getCode<GetGenres>>,
  ) => {
    try {
      const { rows } = await pg.query(sql`
        SELECT * FROM genres
    `);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
