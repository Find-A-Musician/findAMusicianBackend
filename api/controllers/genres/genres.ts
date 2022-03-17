import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type core from 'express-serve-static-core';
import { getRepository } from 'typeorm';
import { Genre } from '../../entity';

type GetGenres = operations['getGenres'];

export const getGenres = async (
  req: core.Request,
  res: core.Response<getResponsesBody<GetGenres>, {}, getHTTPCode<GetGenres>>,
): Promise<
  core.Response<getResponsesBody<GetGenres>, {}, getHTTPCode<GetGenres>>
> => {
  try {
    const genres = await getRepository(Genre).find();
    return res.status(200).json(genres);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};
