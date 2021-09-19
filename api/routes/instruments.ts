import express, {Request, Response} from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type {operations} from '@schema';
import {HttpError} from 'api/types/typing';

type GetInstruments = operations['getInstruments'];
type GetInstrumentsResponse =
  GetInstruments['responses']['200']['content']['application/json'];

const router = express.Router();

router.get(
    '/',
    async (
        req: Request,
        res: Response<GetInstrumentsResponse | HttpError, {}>,
    ) => {
      try {
        const {rows} = await pg.query(sql`SELECT * FROM instruments`);
        res.status(200).json(rows as GetInstrumentsResponse);
      } catch (err) {
        res.status(500).json({code: 500, msg: 'E_SQL_ERROR', stack: err});
      }
    },
);

export default router;
