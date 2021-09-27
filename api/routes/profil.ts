import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody, getRequestBody } from '@typing';

type getProfil = operations['getProfil'];
type patchProfil = operations['patchProfil'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<
      getResponsesBody<getProfil>,
      Record<string, never>,
      getHTTPCode<getProfil>
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
      res.status(200).json(response as getResponsesBody<getProfil>);
    } catch (err) {
      res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

router.patch(
  '/',
  async (
    req: Request<
      Record<string, never>,
      getResponsesBody<patchProfil>,
      getRequestBody<patchProfil>,
      Record<string, never>
    >,
    res: core.Response<
      getResponsesBody<patchProfil>,
      Record<string, never>,
      getHTTPCode<patchProfil>
    >,
  ) => {
    if (req.params.musicianId !== req.userId) {
      res.status(403).json({ msg: 'E_UNAUTHORIZED_TOKEN' });
    }
    try {
      if (req.body.email) {
        await pg.query(sql`
                  UPDATE musicians
                  SET email = ${req.body.email}
                  WHERE id = ${req.userId}
              `);
      }
      if (req.body.facebookUrl) {
        await pg.query(sql`
                    UPDATE musicians
                    SET facebook_url = ${req.body.facebookUrl}
                    WHERE id = ${req.userId}
                `);
      }
      if (req.body.instagramUrl) {
        await pg.query(sql`
                      UPDATE musicians
                      SET instagrams_url = ${req.body.instagramUrl}
                      WHERE id = ${req.userId}
                  `);
      }
      if (req.body.twitterUrl) {
        await pg.query(sql`
                        UPDATE musicians
                        SET twitter_url = ${req.body.twitterUrl}
                        WHERE id = ${req.userId}
                    `);
      }
      if (req.body.familyName) {
        await pg.query(sql`
                          UPDATE musicians
                          SET family_name = ${req.body.familyName}
                          WHERE id = ${req.userId}
                      `);
      }
      if (req.body.givenName) {
        await pg.query(sql`
                            UPDATE musicians
                            SET given_name = ${req.body.givenName}
                            WHERE id = ${req.userId}
                        `);
      }
      if (req.body.phone) {
        await pg.query(sql`
                              UPDATE musicians
                              SET phone = ${req.body.phone}
                              WHERE id = ${req.userId}
                          `);
      }
      if (req.body.promotion) {
        await pg.query(sql`
                                UPDATE musicians
                                SET promotion = ${req.body.promotion}
                                WHERE id = ${req.userId}
                            `);
      }
      if (req.body.location) {
        await pg.query(sql`
                                  UPDATE musicians
                                  SET location = ${req.body.location}
                                  WHERE id = ${req.userId}
                              `);
      }
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ msg: 'E_PG_QUERY', stack: err });
    }
  },
);
export default router;
