import { getRepository } from 'typeorm';
import { Groups, Event, EventGroupJoin } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { NextFunction } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type JoinEvent = operations['groupJoinEvent'];

export const groupJoinEvent = async (
  req: Request<{}, getResponsesBody<JoinEvent>, getRequestBody<JoinEvent>, {}>,
  res: core.Response<getResponsesBody<JoinEvent>, {}, getHTTPCode<JoinEvent>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<JoinEvent>, {}, getHTTPCode<JoinEvent>>
> => {
  try {
    const groupId = req.body.groupId;
    const eventId = req.body.eventId;

    const group = await getRepository(Groups).findOne({
      where: { id: groupId },
      relations: ['members', 'members.musician'],
    });

    if (!group) {
      return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
    }

    const event = await getRepository(Event).findOne({
      where: { id: eventId },
      relations: ['groups'],
    });

    if (!event) {
      return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
    }

    event.groups = [...event.groups, group];

    await getRepository(Event).save(event);

    const notifications = group.members.map((member) =>
      getRepository(EventGroupJoin).create({
        musician: member.musician,
        group: group,
        event: event,
      }),
    );

    await getRepository(EventGroupJoin).save(notifications);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
