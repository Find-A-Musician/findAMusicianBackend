import { getRepository } from 'typeorm';
import { Musician, Groups, Event } from '../../entity';
import type { operations } from '../../types/schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type core from 'express-serve-static-core';
import type { NextFunction } from 'express';

type Info = operations['getApplicationInfo'];

export const getInfo = async (
  req: core.Request,
  res: core.Response<getResponsesBody<Info>, {}, getHTTPCode<Info>>,
  next: NextFunction,
): Promise<core.Response<getResponsesBody<Info>, {}, getHTTPCode<Info>>> => {
  try {
    const nbMusician = await getRepository(Musician).count();
    const nbGroups = await getRepository(Groups).count();
    const nbEvents = await getRepository(Event).count();

    return res.status(200).json({
      nbMusician,
      nbGroups,
      nbEvents,
    });
  } catch (err) {
    next(err);
  }
};
