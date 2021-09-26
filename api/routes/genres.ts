import express, { Request, Response } from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import { HttpError } from 'api/types/typing';

const router = express.Router();

type GetGenres = operations['getGenres'];
type GetGenresResponse =
  GetGenres['responses']['200']['content']['application/json'];

router.get(
  '/',
  async (req: Request, res: Response<GetGenresResponse | HttpError>) => {
    try {
      const { rows } = await pg.query(sql`
        SELECT * FROM genres
    `);
      console.log('ocucou');
      res.status(200).json(rows);
    } catch (err) {
      res
        .status(500)
        .set('coucou', 'ddedsd')
        .json({ code: 500, msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
