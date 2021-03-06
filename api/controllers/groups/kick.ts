import { getRepository, Not } from 'typeorm';
import { GroupKickNotification, MusicianGroup } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { FindConditions } from 'typeorm';
import type { NextFunction } from 'express';
import type { operations } from '@schema';
import type { getHTTPCode, getPathParams, getResponsesBody } from '@typing';

type KickGroupMusician = operations['groupKickMusician'];

export const kickMusicianFromGroup = async (
  req: Request<
    getPathParams<KickGroupMusician>,
    getResponsesBody<KickGroupMusician>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<KickGroupMusician>,
    {},
    getHTTPCode<KickGroupMusician>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<KickGroupMusician>,
    {},
    getHTTPCode<KickGroupMusician>
  >
> => {
  try {
    const musicianGroupRepository = getRepository(MusicianGroup);

    const groupId = req.params.groupId;
    const musicianId = req.params.musicianId;

    const query: FindConditions<MusicianGroup> = {
      musician: {
        id: req.userId,
      },
      group: {
        id: groupId,
      },
    };

    const admin = await musicianGroupRepository.findOne({
      where: [
        {
          membership: 'admin',
          ...query,
        },
        {
          membership: 'lite_admin',
          ...query,
        },
      ],
      relations: ['musician', 'group'],
    });

    if (!admin) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const musicianToKick = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: musicianId,
        },
        group: {
          id: groupId,
        },
        membership: Not('admin'),
      },
      relations: ['musician', 'group'],
    });

    if (!musicianToKick) {
      return res.status(404).json({ msg: 'E_MUSICIAN_NOT_IN_GROUP' });
    }

    if (
      musicianToKick.membership === 'lite_admin' &&
      admin.membership === 'lite_admin'
    ) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    await musicianGroupRepository.delete({
      musician: {
        id: musicianId,
      },
      group: {
        id: groupId,
      },
    });

    const notification = getRepository(GroupKickNotification).create({
      group: musicianToKick.group,
      musician: musicianToKick.musician,
    });

    await getRepository(GroupKickNotification).save(notification);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
