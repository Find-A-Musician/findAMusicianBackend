import { getRepository } from 'typeorm';
import { Notification } from '../../entity';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getPathParams, getResponsesBody } from '@typing';
import type { NextFunction } from 'express';

type GetNotification = operations['getNotifications'];
type DeleteNotificationById = operations['deleteNotificationById'];
type DeleteAllNotifications = operations['deleteAllNotifications'];

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
      where: {
        musician: {
          id: req.userId,
        },
      },
      relations: ['group', 'group.genres', 'event', 'event.genres'],
    });

    return res.status(200).json(notications);
  } catch (err) {
    next(err);
  }
};

export const deleteAllNotifications = async (
  req: Request,
  res: core.Response<
    getResponsesBody<DeleteAllNotifications>,
    {},
    getHTTPCode<DeleteAllNotifications>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<DeleteAllNotifications>,
    {},
    getHTTPCode<DeleteAllNotifications>
  >
> => {
  try {
    await getRepository(Notification).delete({
      musician: {
        id: req.userId,
      },
    });

    // console.log(notications[0]);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const deleteNotificationById = async (
  req: Request<
    getPathParams<DeleteNotificationById>,
    getResponsesBody<DeleteNotificationById>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<DeleteNotificationById>,
    {},
    getHTTPCode<DeleteNotificationById>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<DeleteNotificationById>,
    {},
    getHTTPCode<DeleteNotificationById>
  >
> => {
  try {
    const notificationRepository = getRepository(Notification);

    const notication = await notificationRepository.findOne({
      id: req.params.notificationId,
    });

    if (!notication) {
      return res.status(404).json({ msg: 'E_NOTIFICATION_DOES_NOT_EXIST' });
    }

    await notificationRepository.delete({
      id: notication.id,
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
