import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type { Request } from 'express';

type GetInstruments = operations['getInstruments'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<
      getResponsesBody<GetInstruments>,
      {},
      getHTTPCode<GetInstruments>
    >,
  ) => {
    try {
      const {
        rows,
      }: {
        rows: {
          id: string;
          name: string;
        }[];
      } = await pg.query(sql`SELECT * FROM instruments`);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
    }
  },
);

export default router;
