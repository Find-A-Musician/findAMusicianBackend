import { getRepository } from 'typeorm';
import { Invitation } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { NextFunction } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';

type GetUserInvitationReceived = operations['getUserInvitationReceived'];
type GetUserInvitationSent = operations['getUserInvitationSent'];

export const getUserInvitationsReceived = async (
  req: Request<{}, getResponsesBody<GetUserInvitationReceived>, {}, {}>,
  res: core.Response<
    getResponsesBody<GetUserInvitationReceived>,
    {},
    getHTTPCode<GetUserInvitationReceived>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<GetUserInvitationReceived>,
    {},
    getHTTPCode<GetUserInvitationReceived>
  >
> => {
  try {
    const invitationRepo = getRepository(Invitation);

    const invitations = await invitationRepo.find({
      where: {
        type: 'groupToMusician',
        musician: req.userId,
      },
      relations: ['group', 'instruments', 'group.genres'],
    });

    return res.status(200).json(invitations);
  } catch (err) {
    next(err);
  }
};

export const getUserInvitationsSent = async (
  req: Request<{}, getResponsesBody<GetUserInvitationSent>, {}, {}>,
  res: core.Response<
    getResponsesBody<GetUserInvitationSent>,
    {},
    getHTTPCode<GetUserInvitationSent>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<GetUserInvitationSent>,
    {},
    getHTTPCode<GetUserInvitationSent>
  >
> => {
  try {
    const invitationRepo = getRepository(Invitation);

    const invitations = await invitationRepo.find({
      where: {
        type: 'musicianToGroup',
        musician: req.userId,
      },
      relations: ['group', 'instruments', 'group.genres'],
    });

    return res.status(200).json(invitations);
  } catch (err) {
    next(err);
  }
};
