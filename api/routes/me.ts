import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody } from '@typing';

type Me = operations['me'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<
      getResponsesBody<Me>,
      Pick<string, never>,
      getHTTPCode<Me>
    >,
  ) => {
    try {
      const {
        rows: [musicianResponse],
      } = await pg.query(sql`
            SELECT *
            FROM musicians 
            WHERE musicians.id = ${req.userId}
        `);

      const { rows: instrumentsResponse } = await pg.query(sql`
        SELECT instruments.* 
        FROM instruments
        INNER JOIN musicians_instruments
        ON instruments.id = musicians_instruments.instrument
        WHERE musicians_instruments.musician= ${req.userId}
    `);

      const { rows: genresResponse } = await pg.query(sql`
        SELECT genres.* 
        FROM genres
        INNER JOIN musicians_genres
        ON musicians_genres.genre=genres.id
        WHERE musicians_genres.musician = ${req.userId}
    `);

      const response = {
        musician: musicianResponse,
        instruments: instrumentsResponse,
        genres: genresResponse,
      };

      res.status(200).json(response as getResponsesBody<Me>);
    } catch (err) {
      res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
