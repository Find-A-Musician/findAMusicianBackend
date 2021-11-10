import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody, getRequestBody } from '@typing';

type getProfil = operations['getProfil'];
type patchProfil = operations['patchProfil'];
type deleteProfil = operations['deleteProfil'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<getResponsesBody<getProfil>, {}, getHTTPCode<getProfil>>,
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
      return res.status(200).json(response as getResponsesBody<getProfil>);
    } catch (err) {
      return res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

router.patch(
  '/',
  async (
    req: Request<
      {},
      getResponsesBody<patchProfil>,
      getRequestBody<patchProfil>,
      {}
    >,
    res: core.Response<
      getResponsesBody<patchProfil>,
      {},
      getHTTPCode<patchProfil>
    >,
  ) => {
    try {
      if (req.body.email) {
        await pg.query(sql`
                  UPDATE musicians
                  SET email = ${req.body.email}
                  WHERE id = ${req.userId}
              `);
      }
      if (req.body.facebook_url) {
        await pg.query(sql`
                    UPDATE musicians
                    SET facebook_url = ${req.body.facebook_url}
                    WHERE id = ${req.userId}
                `);
      }
      if (req.body.instagram_url) {
        await pg.query(sql`
                      UPDATE musicians
                      SET instagrams_url = ${req.body.instagram_url}
                      WHERE id = ${req.userId}
                  `);
      }
      if (req.body.twitter_url) {
        await pg.query(sql`
                        UPDATE musicians
                        SET twitter_url = ${req.body.twitter_url}
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

      //update the instruments of the user

      try {
        for (let index = 0; index < req.body.instruments.length; index++) {
          await pg.query(sql`
          DELETE FROM musicians_instruments
          WHERE musician=${req.userId}
            AND instrument = ${req.body.instruments[index].id}
        `);
          await pg.query(sql`
            INSERT INTO musicians_instruments (
              musician,
              instrument
            ) VALUES (
              ${req.userId},
              ${req.body.instruments[index].id}
            )
          `);
        }
      } catch (err) {
        return res
          .status(500)
          .json({ msg: 'E_SQL_ERROR_INSTRUMENTS', stack: err });
      }

      // //update the genres of the user

      try {
        for (let index = 0; index < req.body.genres.length; index++) {
          await pg.query(sql`
            DELETE FROM musicians_genres
            WHERE musician=${req.userId}
              AND genre = ${req.body.genres[index].id}
          `);
          await pg.query(sql`
          INSERT INTO musicians_genres (
            musician,
            genre
          ) VALUES (
            ${req.userId},
            ${req.body.genres[index].id}
          )
        `);
        }
      } catch (err) {
        return res.status(500).json({ msg: 'E_SQL_ERROR_GENRES', stack: err });
      }

      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.delete(
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<deleteProfil>,
      getRequestBody<deleteProfil>
    >,
    res: core.Response<
      getResponsesBody<deleteProfil>,
      {},
      getHTTPCode<deleteProfil>
    >,
  ) => {
    try {
      await pg.query(sql`
        DELETE FROM musicians
        WHERE id = ${req.userId}
      `);

      return res.status(200).json('The user has been deleted');
    } catch (err) {
      return res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
