import type { operations } from '@schema';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

import { getRepository } from 'typeorm';
import { Groups, Event } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';

type JoinEvent = operations['groupJoinEvent'];

export const groupJoinEvent = async (
  req: Request<{}, getResponsesBody<JoinEvent>, getRequestBody<JoinEvent>, {}>,
  res: core.Response<getResponsesBody<JoinEvent>, {}, getHTTPCode<JoinEvent>>,
): Promise<
  core.Response<getResponsesBody<JoinEvent>, {}, getHTTPCode<JoinEvent>>
> => {
  try {
    const group = await getRepository(Groups).findOne({
      where: { id: req.body.groupId },
      relations: ['events'],
    });

    if (!group) {
      return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
    }

    const newEvent = await getRepository(Event).findOne({
      id: req.body.eventId,
    });

    if (!newEvent) {
      return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
    }

    group.events.push(newEvent);

    await getRepository(Groups).save(group);

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};
