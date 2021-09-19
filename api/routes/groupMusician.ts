import express, {Request, Response} from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import {operations} from '@schema';
import {HttpError} from 'api/types/typing';

type inviteUserInGroup = operations['inviteInAGroup'];
type inviteUserInGroupBody =
  inviteUserInGroup['requestBody']['content']['application/json'];
type inviteUserInGroupResponse = inviteUserInGroup['responses']['201'];

const router = express.Router();

router.post(
    '/',
    async (
        req: Request<{}, {}, inviteUserInGroupBody, {}>,
        res: Response<HttpError | inviteUserInGroupResponse, {}>,
    ) => {
      const musicianId = req.body.musicianId;
      const groupId=req.body.groupId;
      const invitorId = req.userId;
      const instrument = req.body.instrumentId;
      try {
        const {rows: musicianGroupResult}=await pg.query(sql`
          SELECT * FROM groups_musicians
          WHERE "group"=${groupId}
            AND musician=${musicianId}
        `);
        if (musicianGroupResult.length!==0) {
          res.status(403).json({code: 403, msg: 'E_ALREADY_INVITED'});
        }

        const {rows: invitorInfo}=await pg.query(sql`
          SELECT role FROM groups_musicians
          WHERE musician = ${invitorId}
        `);

        if (invitorInfo.length==0 || invitorInfo[0].role ) {
          res.status(403).json({code: 403, msg: 'E_UNAUTHORIZE_INVITOR'});
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
        res.status(500).json({code: 500, msg: 'E_SQL_ERROR', stack: err});
      }
    },
);

export default router;
