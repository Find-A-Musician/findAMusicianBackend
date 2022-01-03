import express from 'express';
import pg from '../../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getResponsesBody,
} from '@typing';

type GetMusician = operations['getMusicians'];
type GetMusicianById = operations['getMusicianById'];
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
      const { rows } = await pg.query(
        sql`SELECT id,
                  email,
                  given_name as "givenName",
                  family_name as "familyName",
                  phone,
                  facebook_url,
                  twitter_url,
                  instagram_url,
                  promotion,
                  location 
              FROM musicians`,
      );

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

      return res.status(200).json(rows);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.get(
  '/:musicianId',
  async (
    req: Request<
      getPathParams<GetMusicianById>,
      getResponsesBody<GetMusicianById>,
      getRequestBody<GetMusicianById>,
      {}
    >,
    res: core.Response<
      getResponsesBody<GetMusicianById>,
      {},
      getHTTPCode<GetMusicianById>
    >,
  ) => {
    try {
      const { rows } = await pg.query(sql`
        SELECT id,
              email,
              given_name as "givenName",
              family_name as "familyName",
              phone,
              facebook_url,
              twitter_url,
              instagram_url,
              promotion,
              location 
        FROM musicians
        WHERE id = ${req.params.musicianId}
      `);

      if (rows.length === 0) {
        return res.status(404).json({ msg: 'E_MUSICIAN_DOES_NOT_EXIST' });
      }

      const { rows: instrumentsRows } = await pg.query(sql`
        SELECT instruments.* 
        FROM instruments
        INNER JOIN musicians_instruments
        ON instruments.id = musicians_instruments.instrument
        WHERE musicians_instruments.musician= ${req.params.musicianId}`);

      rows[0]['instruments'] = instrumentsRows;

      const { rows: genreRows } = await pg.query(sql`
        SELECT genres.* 
        FROM genres
        INNER JOIN musicians_genres
        ON musicians_genres.genre=genres.id
        WHERE musicians_genres.musician = ${req.params.musicianId}`);

      rows[0]['genres'] = genreRows;

      return res.status(200).json(rows[0]);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
