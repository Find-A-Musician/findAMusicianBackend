import { getRepository } from 'typeorm';
import { Invitation, MusicianGroup } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { NextFunction } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getPathParams, getResponsesBody } from '@typing';

type GetGroupInvitationReceived = operations['getGroupInvitationReceived'];

export const getGroupInvitations = async (
  req: Request<
    getPathParams<GetGroupInvitationReceived>,
    getResponsesBody<GetGroupInvitationReceived>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<GetGroupInvitationReceived>,
    {},
    getHTTPCode<GetGroupInvitationReceived>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<GetGroupInvitationReceived>,
    {},
    getHTTPCode<GetGroupInvitationReceived>
  >
> => {
  try {
    const invitationRepo = getRepository(Invitation);
    const musicianGroupRepository = getRepository(MusicianGroup);
    const groupId = req.params.groupId;

    const group = await musicianGroupRepository.findOne({
      where: {
        group: {
          id: groupId,
        },
        musician: {
          id: req.userId,
        },
      },
    });

    if (!group) {
      res.status(404).json({ msg: 'E_MUSICIAN_NOT_MEMBER' });
    }

    const invitations = await invitationRepo.find({
      where: {
        type: 'musicianToGroup',
        group: groupId,
      },
      relations: ['musician', 'instruments'],
    });

    return res.status(200).json(invitations);
  } catch (err) {
    next(err);
  }
};
