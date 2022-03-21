import { getRepository } from 'typeorm';
import { Event } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getPathParams, getResponsesBody } from '@typing';
import type { NextFunction } from 'express';
type KickEventGroup = operations['eventKickGroup'];

export const kickGroupFromEvent = async (
  req: Request<
    getPathParams<KickEventGroup>,
    getResponsesBody<KickEventGroup>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<KickEventGroup>,
    {},
    getHTTPCode<KickEventGroup>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<KickEventGroup>,
    {},
    getHTTPCode<KickEventGroup>
  >
> => {
  try {
    const eventRepository = getRepository(Event);

    const eventId = req.params.eventId;
    const groupIdToKick = req.params.groupId;

    const event = await eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ['admins', 'groups'],
    });

    if (!event) {
      return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
    }

    if (!event.admins.some(({ id }) => id == req.userId)) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    if (!event.groups.some(({ id }) => id == groupIdToKick)) {
      return res.status(403).json({ msg: 'E_GROUP_NOT_IN_EVENT' });
    }

    event.groups = event.groups.filter(({ id }) => id != groupIdToKick);

    await eventRepository.save(event);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
