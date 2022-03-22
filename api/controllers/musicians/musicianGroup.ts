import { getRepository } from 'typeorm';
import { MusicianGroup } from '../../entity';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getPathParams, getResponsesBody } from '@typing';
import type { NextFunction } from 'express';

type GetMusicianGroupMembership = operations['getMusicianGroupMembership'];

export const getMusicianGroupMembership = async (
  req: Request<
    getPathParams<GetMusicianGroupMembership>,
    getResponsesBody<GetMusicianGroupMembership>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<GetMusicianGroupMembership>,
    {},
    getHTTPCode<GetMusicianGroupMembership>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<GetMusicianGroupMembership>,
    {},
    getHTTPCode<GetMusicianGroupMembership>
  >
> => {
  try {
    const musicianGroupRepository = getRepository(MusicianGroup);

    const musicianGroup = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: req.params.musicianId,
        },
        group: {
          id: req.params.groupId,
        },
      },
      relations: ['musician', 'group'],
    });

    if (!musicianGroup) {
      return res
        .status(404)
        .json({ msg: 'E_MUSICIAN_OR_GROUP_DOES_NOT_EXIST' });
    }

    return res.status(200).json({ membership: await musicianGroup.membership });
  } catch (err) {
    next(err);
  }
};
