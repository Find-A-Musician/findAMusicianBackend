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
      console.log('\n------------------\n');
      console.log(req.params);
      console.log('\n------------------\n');
      console.log(req.body);
      const {rows} = await pg.query(
          sql` SELECT email 
            FROM musicians 
            WHERE id=${req.params.musicianId}
        `,
      );
      console.log('\n------------------\n');
      console.log(rows[0].email);
      console.log(req.user);
      if (!rows) {
        res.status(400).json({code: 400, msg: 'E_INVALID_USERID'});
      }
      if (rows[0].email !== req.user) {
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
                WHERE email = ${req.user}
            `);
        }
        if (req.body.facebookUrl) {
          await pg.query(sql`
                  UPDATE musicians 
                  SET facebook_url = ${req.body.facebookUrl}
                  WHERE email = ${req.user}
              `);
        }
        if (req.body.instagramUrl) {
          await pg.query(sql`
                    UPDATE musicians 
                    SET instagrams_url = ${req.body.instagramUrl}
                    WHERE email = ${req.user}
                `);
        }
        if (req.body.twitterUrl) {
          await pg.query(sql`
                      UPDATE musicians 
                      SET twitter_url = ${req.body.twitterUrl}
                      WHERE email = ${req.user}
                  `);
        }
        if (req.body.familyName) {
          await pg.query(sql`
                        UPDATE musicians 
                        SET family_name = ${req.body.familyName}
                        WHERE email = ${req.user}
                    `);
        }
        if (req.body.givenName) {
          await pg.query(sql`
                          UPDATE musicians 
                          SET given_name = ${req.body.givenName}
                          WHERE email = ${req.user}
                      `);
        }
        if (req.body.phone) {
          await pg.query(sql`
                            UPDATE musicians 
                            SET phone = ${req.body.phone}
                            WHERE email = ${req.user}
                        `);
        }
        if (req.body.promotion) {
          await pg.query(sql`
                              UPDATE musicians 
                              SET promotion = ${req.body.promotion}
                              WHERE email = ${req.user}
                          `);
        }
        if (req.body.location) {
          await pg.query(sql`
                                UPDATE musicians 
                                SET location = ${req.body.location}
                                WHERE email = ${req.user}
                            `);
        }
        res.sendStatus(200);
      } catch (err) {
        res.status(500).json({code: 500, msg: 'E_PG_QUERY', stack: err});
      }
    },
);

export default router;
