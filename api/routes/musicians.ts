import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody } from '@typing';

type GetMusician = operations['getMusicians'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<
      getResponsesBody<GetMusician>,
      {},
      getHTTPCode<GetMusician>
    >,
  ) => {
    try {
      const { rows } = await pg.query(sql`SELECT * FROM musicians`);

      for (let i = 0; i < rows.length; i++) {
        const { rows: instrumentsRows } = await pg.query(sql`
      SELECT instruments.* 
      FROM instruments
      INNER JOIN musicians_instruments
      ON instruments.id = musicians_instruments.instrument
      WHERE musicians_instruments.musician= ${rows[i].id}
    `);
        rows[i]['instruments'] = instrumentsRows;
      }
      for (let i = 0; i < rows.length; i++) {
        const { rows: genreRows } = await pg.query(sql`
       SELECT genres.* 
        FROM genres
        INNER JOIN musicians_genres
        ON musicians_genres.genre=genres.id
        WHERE musicians_genres.musician = ${rows[i].id}
    `);
        rows[i]['genres'] = genreRows;
      }

      // The array used in the returned in the response
      // object is filtered to delete all the key/value
      // that are null , for example {phone : null}
      // is deleted

      console.log(rows[1].phone);
      console.log(typeof rows[1].phone);

      console.log('--------\n');

      console.log(rows[1].facebook_url);
      console.log(typeof rows[1].facebook_url);

      return res
        .status(200)
        .setHeader('content-type', 'application/json')
        .json(
          rows.map((musician) => {
            return Object.fromEntries(
              Object.entries(musician).filter(([k]) => k !== 'phone'),
            );
          }) as getResponsesBody<GetMusician>,
        );
    } catch (err) {
      return res.status(500).json({ msg: 'E_SQL_ERROR' });
    }
  },
);

export default router;
