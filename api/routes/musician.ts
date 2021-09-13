import express, {Request, Response} from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type {operations} from '@schema';
import {HttpError} from '@typing';

type PatchMusician = operations['patchMusician'];
type PatchMusicianBody =
  PatchMusician['requestBody']['content']['application/json'];
type PatchMusicianParams = PatchMusician['parameters']['path'];

const router = express.Router();

router.patch(
    '/:musicianId',
    async (
        req: Request<PatchMusicianParams, {}, PatchMusicianBody, {}>,
        res: Response<{} | HttpError, {}>,
    ) => {
      if (req.params.musicianId !== req.userId) {
        res.status(403).json({code: 403, msg: 'E_UNAUTHORIZED_TOKEN'});
      }
      if (!req.body) {
        res.status(400).json({code: 400, msg: 'E_EMPTY_BODY'});
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
        res.status(500).json({code: 500, msg: 'E_PG_QUERY', stack: err});
      }
    },
);

export default router;
