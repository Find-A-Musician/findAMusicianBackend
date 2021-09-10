import express, {Request, Response} from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type {operations} from '@schema';
import {HttpError} from '@typing';

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
      const {rows} = await pg.query(sql`SELECT * FROM instruments`);
      res.status(200).json(rows as GetInstrumentsResponse);
    },
);

export default router;
