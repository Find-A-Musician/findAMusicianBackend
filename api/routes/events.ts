import express from 'express';
import pg from '../postgres';
import { v4 as uuidV4 } from 'uuid';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getResponsesBody,
  getRequestBody,
  getPathParams,
} from '@typing';
import type core from 'express-serve-static-core';

const router = express.Router();

type GetEvents = operations['getEvents'];
type PostEvents = operations['postEvents'];

router.get(
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<GetEvents>,
      getRequestBody<GetEvents>,
      getPathParams<GetEvents>
    >,
    res: core.Response<getResponsesBody<GetEvents>, {}, getHTTPCode<GetEvents>>,
  ) => {
    try {
      const { rows } = await pg.query(sql`
            SELECT * FROM events
        `);
      console.log(rows);
      return res.status(200).json(rows);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);
type test = getResponsesBody<PostEvents>;

router.post(
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<PostEvents>,
      getRequestBody<PostEvents>,
      getPathParams<PostEvents>
    >,
    res: core.Response<
      getResponsesBody<PostEvents>,
      {},
      getHTTPCode<PostEvents>
    >,
  ) => {
    try {
      const id = uuidV4();
      await pg.query(sql`
              INSERT INTO events (
                  id,
                  name,
                  description,
                  start_date,
                  end_date,
                  adress
              ) VALUES (
                  ${id},
                  ${req.body.name},
                  ${req.body.description},
                  ${req.body.start_date},
                  ${req.body.end_date},
                  ${req.body.adress}
              );
          `);
      res.sendStatus(201);
    } catch (err) {
      if (err.constraint === 'events_name_key') {
        return res.status(401).json({ msg: 'E_EVENT_NAME_ALREADY_TAKEN' });
      } else {
        return res
          .status(500)
          .json({ msg: 'E_SQL_ERR', stack: JSON.stringify(err) });
      }
    }
  },
);

export default router;
