import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type core from 'express-serve-static-core';
import { Request } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody, getRequestBody } from '@typing';

type inviteUserInGroup = operations['sendGroupInvitation'];
type responseUserInGroup = operations['responseGroupInvitation'];
const router = express.Router();

router.post(
  '/send',
  async (
    req: Request<
      {},
      getResponsesBody<inviteUserInGroup>,
      getRequestBody<inviteUserInGroup>,
      {}
    >,
    res: core.Response<
      getResponsesBody<inviteUserInGroup>,
      {},
      getHTTPCode<inviteUserInGroup>
    >,
  ) => {
    const musicianId = req.body.musicianId;
    const groupId = req.body.groupId;
    const invitorId = req.userId;
    const instrument = req.body.instrumentId;
    const role = req.body.role;
    try {
      const { rows: musicianGroupResult } = await pg.query(sql`
          SELECT * FROM groups_musicians
          WHERE "group"=${groupId}
            AND musician=${musicianId}
        `);
      if (musicianGroupResult.length !== 0) {
        return res.status(400).json({ msg: 'E_ALREADY_INVITED' });
      }
      const { rows: invitorInfo } = await pg.query(sql`
          SELECT role FROM groups_musicians
          WHERE musician = ${invitorId}
        `);
      console.log(invitorInfo);
      console.log(invitorInfo.length);
      if (invitorInfo.length === 0 || invitorInfo[0].role === 'member') {
        return res.status(401).json({
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
          ${role}
        )
        `);
      // créer une notification
      return res.status(201).json('The user has been invited');
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

router.post(
  '/response',
  async (
    req: core.Request<
      {},
      getResponsesBody<responseUserInGroup>,
      getRequestBody<responseUserInGroup>
    >,
    res: core.Response<
      getResponsesBody<responseUserInGroup>,
      {},
      getHTTPCode<responseUserInGroup>
    >,
  ) => {
    try {
      const { rows: userInvitationStatus } = await pg.query(sql`
      SELECT membership FROM groups_musicians
      WHERE "group"=${req.body.groupId}
        AND musician = ${req.userId}
    `);

      if (userInvitationStatus.length === 0) {
        return res
          .status(401)
          .json({ msg: "User can't respond to this invitation" });
      }

      if (userInvitationStatus[0].membership !== 'pending') {
        return res.status(401).json({ msg: 'The user has already responded' });
      }

      await pg.query(sql`
        UPDATE groups_musicians 
        SET membership = ${req.body.response}
        WHERE "group"=${req.body.groupId}
          AND musician = ${req.userId}
      `);

      res.status(201).json('The user membership has been updated');
    } catch (err) {
      return res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
