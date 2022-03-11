import express from 'express';

import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type core from 'express-serve-static-core';
import { getRepository } from 'typeorm';
import { Genre } from '../../entity';

const router = express.Router();

type GetGenres = operations['getGenres'];

router.get(
  '/',
  async (
    req: core.Request,
    res: core.Response<getResponsesBody<GetGenres>, {}, getHTTPCode<GetGenres>>,
  ) => {
    try {
      const genres = await getRepository(Genre).find();
      return res.status(200).json(genres);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
