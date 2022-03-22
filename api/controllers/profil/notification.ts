import { getRepository } from 'typeorm';
import { Notification } from '../../entity';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type { NextFunction } from 'express';

type GetNotification = operations['getNotifications'];

export const getNotifications = async (
  req: Request,
  res: core.Response<
    getResponsesBody<GetNotification>,
    {},
    getHTTPCode<GetNotification>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<GetNotification>,
    {},
    getHTTPCode<GetNotification>
  >
> => {
  try {
    const notications = await getRepository(Notification).find({
      relations: ['group', 'group.genres'],
    });

    // console.log(notications[0]);

    return res.status(200).json(notications);
  } catch (err) {
    next(err);
  }
};
