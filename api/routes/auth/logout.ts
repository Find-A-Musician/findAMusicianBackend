import express from 'express';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import { getRepository } from 'typeorm';
import { Token, Musician } from '../../entity';

type Logout = operations['logout'];

const router = express.Router();

router.delete(
  '/',
  async (
    req: Request,
    res: core.Response<getResponsesBody<Logout>, {}, getHTTPCode<Logout>>,
  ) => {
    try {
      const musician = await getRepository(Musician).findOne({
        id: req.userId,
      });

      await getRepository(Token).delete({ musician });

      return res.status(200).json('the user has been logout');
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
