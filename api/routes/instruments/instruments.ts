import express from 'express';

import type { operations } from '@schema';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type { Request } from 'express';
import { getRepository } from 'typeorm';
import { Instrument } from '../../entity';

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
      const instruments = await getRepository(Instrument).find();

      return res.status(200).json(instruments);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
