import { getRepository } from 'typeorm';
import { Token, Musician } from '../../entity';
import type core from 'express-serve-static-core';
import type { NextFunction, Request } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';

type Logout = operations['logout'];

const logout = async (
  req: Request,
  res: core.Response<getResponsesBody<Logout>, {}, getHTTPCode<Logout>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<Logout>, {}, getHTTPCode<Logout>>
> => {
  try {
    const musician = await getRepository(Musician).findOne({
      id: req.userId,
    });

    await getRepository(Token).delete({ musician });

    return res.status(200).json('the user has been logout');
  } catch (err) {
    next(err);
  }
};

export { logout };
