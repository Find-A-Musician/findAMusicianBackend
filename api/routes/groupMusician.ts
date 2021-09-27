import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type core from 'express-serve-static-core';
import { Request } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody, getRequestBody } from '@typing';

type inviteUserInGroup = operations['inviteInAGroup'];

const router = express.Router();

router.post(
  '/',
  async (
    req: Request<
      Record<string, never>,
      getResponsesBody<inviteUserInGroup>,
      getRequestBody<inviteUserInGroup>,
      Record<string, never>
    >,
    res: core.Response<
      getResponsesBody<inviteUserInGroup>,
      Record<string, never>,
      getHTTPCode<inviteUserInGroup>
    >,
  ) => {
    const musicianId = req.body.musicianId;
    const groupId = req.body.groupId;
    const invitorId = req.userId;
    const instrument = req.body.instrumentId;
    try {
      const { rows: musicianGroupResult } = await pg.query(sql`
          SELECT * FROM groups_musicians
          WHERE "group"=${groupId}
            AND musician=${musicianId}
        `);
      if (musicianGroupResult.length !== 0) {
        res.status(400).json({ msg: 'E_ALREADY_INVITED' });
      }
      const { rows: invitorInfo } = await pg.query(sql`
          SELECT role FROM groups_musicians
          WHERE musician = ${invitorId}
        `);
      if (invitorInfo.length == 0 || invitorInfo[0].role) {
        res.status(401).json({
          msg: 'E_UNAUTHORIZE_INVITOR',
        });
      }
      await pg.query(sql`
        INSERT INTO groups_musicians (
          "group",
          musician,
          instrument,
          membership,
          role
        ) VALUES (
          ${groupId},
          ${musicianId},
          ${instrument},
          'pending',
          'member'
        )
        `);
      // créer une notification
      res.sendStatus(201);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
