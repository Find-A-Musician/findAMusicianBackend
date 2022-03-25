import { getRepository } from 'typeorm';
import { Groups, Instrument, Invitation, MusicianGroup } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { NextFunction } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type GetUserInvitationReceived = operations['getUserInvitationReceived'];
type GetUserInvitationSent = operations['getUserInvitationSent'];
type PostUserToGroupInvitation = operations['postUserToGroupInvitation'];

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

export const postUserToGroupInvitation = async (
  req: Request<
    {},
    getResponsesBody<PostUserToGroupInvitation>,
    getRequestBody<PostUserToGroupInvitation>,
    {}
  >,
  res: core.Response<
    {},
    getResponsesBody<PostUserToGroupInvitation>,
    getHTTPCode<PostUserToGroupInvitation>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<PostUserToGroupInvitation>,
    {},
    getHTTPCode<PostUserToGroupInvitation>
  >
> => {
  try {
    const groupId = req.body.groupId;
    const instruments = req.body.instruments;

    const invitationRepo = getRepository(Invitation);

    const invitation = await invitationRepo.findOne({
      join: {
        alias: 'invitation',
        innerJoin: {
          group: 'invitation.group',
          instruments: 'invitation.instruments',
        },
      },
      where: {
        musician: {
          id: req.userId,
        },
        group: {
          id: groupId,
        },
        type: 'musicianToGroup',
      },
      relations: ['group', 'instruments', 'group.genres', 'musician'],
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
        )
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
      await invitationRepo.save(invitation);
      return res.sendStatus(200);
    }

    const group = await getRepository(Groups).findOne({
      id: groupId,
    });

    if (!group) {
      return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
    }

    const userAlreadyInGroup = await getRepository(MusicianGroup).findOne({
      musician: {
        id: req.userId,
      },
      group: {
        id: groupId,
      },
    });

    if (userAlreadyInGroup) {
      return res.status(422).json({ msg: 'E_USER_ALREADY_IN_GROUP' });
    }

    const newInvition = invitationRepo.create({
      musician: {
        id: req.userId,
      },
      group: {
        id: groupId,
      },
      type: 'musicianToGroup',
      instruments: invitationInstruments,
    });

    await invitationRepo.save(newInvition);

    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};
