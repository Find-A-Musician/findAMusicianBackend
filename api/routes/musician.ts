import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type {
  getHTTPCode,
  getRequestBody,
  getResponsesBody,
  getPathParams,
} from '@typing';

type PatchMusician = operations['patchMusician'];

const router = express.Router();

router.patch(
  '/:musicianId',
  async (
    req: Request<
      getPathParams<PatchMusician>,
      Pick<string, never>,
      getRequestBody<PatchMusician>,
      Pick<string, never>
    >,
    res: core.Response<
      getResponsesBody<PatchMusician>,
      Pick<string, never>,
      getHTTPCode<PatchMusician>
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
