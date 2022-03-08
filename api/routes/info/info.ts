import express from 'express';
import type { operations } from '../../types/schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type core from 'express-serve-static-core';
import { getRepository } from 'typeorm';
import { Musician, Band, Event } from '../../entity';

const router = express.Router();

type Info = operations['getApplicationInfo'];

router.get(
  '/',
  async (
    req: core.Request,
    res: core.Response<getResponsesBody<Info>, {}, getHTTPCode<Info>>,
  ) => {
    try {
      const nbMusician = await getRepository(Musician).count();
      const nbGroups = await getRepository(Band).count();
      const nbEvents = await getRepository(Event).count();

      return res.status(200).json({
        nbMusician,
        nbGroups,
        nbEvents,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
