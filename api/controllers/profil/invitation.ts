import { getRepository } from 'typeorm';
import { Groups, Instrument, Invitation, MusicianGroup } from '../../entity';
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

type GetUserInvitationReceived = operations['getUserInvitationReceived'];
type GetUserInvitationSent = operations['getUserInvitationSent'];
type PostUserToGroupInvitation = operations['postUserToGroupInvitation'];
type DeleteProfilInvitationById = operations['deleteProfilInvitationById'];
type AcceptProfilInvitation = operations['acceptProfilInvitation'];
type DeclineProfilInvitation = operations['declineProfilInvitation'];

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
      relations: ['group', 'instruments', 'group.genres', 'invitor'],
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
    const description = req.body.description;

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
        ) &&
      invitation.description == description
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
      description,
    });

    await invitationRepo.save(newInvition);

    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export const acceptProfilInvitation = async (
  req: Request<
    getPathParams<AcceptProfilInvitation>,
    getResponsesBody<AcceptProfilInvitation>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<AcceptProfilInvitation>,
    {},
    getHTTPCode<AcceptProfilInvitation>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<AcceptProfilInvitation>,
    {},
    getHTTPCode<AcceptProfilInvitation>
  >
> => {
  try {
    const invationId = req.params.invitationId;
    const invitationRepository = getRepository(Invitation);
    const musicianGroupRepository = getRepository(MusicianGroup);

    const invitation = await invitationRepository.findOne({
      where: {
        id: invationId,
        type: 'groupToMusician',
      },
      relations: ['instruments', 'group'],
    });

    if (!invitation) {
      return res.status(404).json({ msg: 'E_INVITATION_DOES_NOT_EXIST' });
    }

    const invitationInstruments: Instrument[] = [];

    for (let i = 0; i < invitation.instruments.length; i++) {
      invitationInstruments.push(
        await getRepository(Instrument).findOne({
          name: invitation.instruments[i].name,
        }),
      );
    }

    const newMusicianGroup = musicianGroupRepository.create({
      musician: {
        id: req.userId,
      },
      group: {
        id: invitation.group.id,
      },
      membership: 'member',
      instruments: invitationInstruments,
    });

    await musicianGroupRepository.save(newMusicianGroup);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const declineProfilInvitation = async (
  req: Request<
    getPathParams<DeclineProfilInvitation>,
    getResponsesBody<DeclineProfilInvitation>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<DeclineProfilInvitation>,
    {},
    getHTTPCode<DeclineProfilInvitation>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<DeclineProfilInvitation>,
    {},
    getHTTPCode<DeclineProfilInvitation>
  >
> => {
  try {
    const invationId = req.params.invitationId;
    const invitationRepository = getRepository(Invitation);

    const invitation = await invitationRepository.findOne({
      where: {
        id: invationId,
        type: 'groupToMusician',
      },
    });

    if (!invitation) {
      return res.status(404).json({ msg: 'E_INVITATION_DOES_NOT_EXIST' });
    }

    await invitationRepository.delete({
      id: invationId,
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const deleteInvitationById = async (
  req: Request<
    getPathParams<DeleteProfilInvitationById>,
    getResponsesBody<DeleteProfilInvitationById>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<DeleteProfilInvitationById>,
    {},
    getHTTPCode<DeleteProfilInvitationById>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<DeleteProfilInvitationById>,
    {},
    getHTTPCode<DeleteProfilInvitationById>
  >
> => {
  try {
    const invationId = req.params.invitationId;
    const invitationRepository = getRepository(Invitation);

    const invitation = await invitationRepository.findOne({
      id: invationId,
      type: 'musicianToGroup',
    });

    if (!invitation) {
      return res.status(404).json({ msg: 'E_INVITATION_DOES_NOT_EXIST' });
    }

    await invitationRepository.delete({
      id: invationId,
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
