import { getRepository } from 'typeorm';
import {
  Groups,
  Instrument,
  Invitation,
  Musician,
  MusicianGroup,
} from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { NextFunction } from 'express';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getResponsesBody,
} from '@typing';

type GetGroupInvitationReceived = operations['getGroupInvitationReceived'];
type GetGroupInvitationSent = operations['getGroupInvitationSent'];
type PostGroupToUserInvitation = operations['postGroupToUserInvitation'];

export const getGroupInvitationsReceived = async (
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

export const getGroupInvitationsSent = async (
  req: Request<
    getPathParams<GetGroupInvitationSent>,
    getResponsesBody<GetGroupInvitationSent>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<GetGroupInvitationSent>,
    {},
    getHTTPCode<GetGroupInvitationSent>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<GetGroupInvitationSent>,
    {},
    getHTTPCode<GetGroupInvitationSent>
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
        type: 'groupToMusician',
        group: groupId,
      },
      relations: ['musician', 'instruments', 'invitor'],
    });
    return res.status(200).json(invitations);
  } catch (err) {
    next(err);
  }
};

export const postGroupToUserInvitation = async (
  req: Request<
    getPathParams<PostGroupToUserInvitation>,
    getResponsesBody<PostGroupToUserInvitation>,
    getRequestBody<PostGroupToUserInvitation>,
    {}
  >,
  res: core.Response<
    {},
    getResponsesBody<PostGroupToUserInvitation>,
    getHTTPCode<PostGroupToUserInvitation>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<PostGroupToUserInvitation>,
    {},
    getHTTPCode<PostGroupToUserInvitation>
  >
> => {
  try {
    const musicianId = req.body.musicianId;
    const groupId = req.params.groupId;
    const instruments = req.body.instruments;
    const description = req.body.description;

    const invitationRepo = getRepository(Invitation);

    const member = await getRepository(MusicianGroup).findOne({
      group: {
        id: groupId,
      },
      musician: {
        id: req.userId,
      },
    });

    if (!member) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const invitation = await invitationRepo.findOne({
      where: {
        musician: {
          id: musicianId,
        },
        group: {
          id: groupId,
        },
        type: 'groupToMusician',
      },
      relations: [
        'group',
        'instruments',
        'group.genres',
        'musician',
        'invitor',
      ],
    });

    /** Check if the invitation already exist with the same instruments
     * If true, we just return 204
     */

    if (
      invitation &&
      instruments.length == invitation.instruments.length &&
      invitation.instruments.length != 0 &&
      instruments
        .map(({ name }) => name)
        .every((name) =>
          invitation.instruments.map(({ name }) => name).includes(name),
        ) &&
      invitation.description === description &&
      invitation.invitor.id === req.userId
    ) {
      return res.sendStatus(200);
    }

    const invitationInstruments: Instrument[] = [];

    for (let i = 0; i < instruments.length; i++) {
      invitationInstruments.push(
        await getRepository(Instrument).findOne({
          name: instruments[i].name,
        }),
      );
    }

    if (invitation) {
      invitation.instruments = invitationInstruments;
      invitation.description = description;
      invitation.invitor.id = req.userId;
      await invitationRepo.save(invitation);
      return res.sendStatus(200);
    }

    const musician = await getRepository(Musician).findOne({
      id: musicianId,
    });

    if (!musician) {
      return res.status(404).json({ msg: 'E_MUSICIAN_DOES_NOT_EXIST' });
    }

    const userAlreadyInGroup = await getRepository(MusicianGroup).findOne({
      musician: {
        id: musicianId,
      },
      group: {
        id: groupId,
      },
    });

    if (userAlreadyInGroup) {
      return res.status(422).json({ msg: 'E_USER_ALREADY_IN_GROUP' });
    }

    const newInvition = invitationRepo.create({
      musician: musician,
      group: {
        id: groupId,
      },
      type: 'groupToMusician',
      instruments: invitationInstruments,
      description,
      invitor: {
        id: req.userId,
      },
    });

    await invitationRepo.save(newInvition);

    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};
