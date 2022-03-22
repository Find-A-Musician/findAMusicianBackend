import { getRepository } from 'typeorm';
import { Genre } from '../../entity';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type { NextFunction } from 'express';
import type core from 'express-serve-static-core';

type GetGenres = operations['getGenres'];

export const getGenres = async (
  req: core.Request,
  res: core.Response<getResponsesBody<GetGenres>, {}, getHTTPCode<GetGenres>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<GetGenres>, {}, getHTTPCode<GetGenres>>
> => {
  try {
    const genres = await getRepository(Genre).find();
    return res.status(200).json(genres);
  } catch (err) {
    next(err);
  }
};
