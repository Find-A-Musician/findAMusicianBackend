import { getRepository } from 'typeorm';
import { Groups, Event } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { NextFunction } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type JoinEvent = operations['groupJoinEvent'];
type LeaveEvent = operations['groupLeaveEvent'];

export const groupJoinEvent = async (
  req: Request<{}, getResponsesBody<JoinEvent>, getRequestBody<JoinEvent>, {}>,
  res: core.Response<getResponsesBody<JoinEvent>, {}, getHTTPCode<JoinEvent>>,
  next: NextFunction,
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
    next(err);
  }
};

export const groupLeaveEvent = async (
  req: Request<{}, getResponsesBody<JoinEvent>, getRequestBody<JoinEvent>, {}>,
  res: core.Response<getResponsesBody<JoinEvent>, {}, getHTTPCode<JoinEvent>>,
  next: NextFunction,
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

    const eventToLeave = await getRepository(Event).findOne({
      id: req.body.eventId,
    });

    if (!eventToLeave) {
      return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
    }

    //searching for the event in the list of the events already joined
    let found = false;
    let index: number;

    for(let e of group.events) {
      if (e === eventToLeave){
        found = true;
        index = group.events.indexOf(e);
        break;
      }
    }

    if(!found)
      return res.status(404).json({ msg: 'E_GROUP_IS_NOT_IN_EVENT' });

    //remove the event from the list
    group.events.splice(index, 1);
    
    await getRepository(Groups).save(group);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
