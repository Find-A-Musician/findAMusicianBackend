import { getRepository } from 'typeorm';
import { MusicianGroup } from '../../entity';
import type { operations } from '@schema';
import type core from 'express-serve-static-core';
import type {
  getHTTPCode,
  getResponsesBody,
  getRequestBody,
  getPathParams,
} from '@typing';
import type { NextFunction } from 'express';

type LeaveGroup = operations['leaveGroup'];

export const leaveGroupById = async (
  req: core.Request<
    getPathParams<LeaveGroup>,
    getResponsesBody<LeaveGroup>,
    getRequestBody<LeaveGroup>,
    {}
  >,
  res: core.Response<getResponsesBody<LeaveGroup>, {}, getHTTPCode<LeaveGroup>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<LeaveGroup>, {}, getHTTPCode<LeaveGroup>>
> => {
  try {
    /**
     * For the moment, only the member can leave group. The admin cannot leave the group
     */

    const musicianGroupRepository = getRepository(MusicianGroup);
    const musicianGroup = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: req.userId,
        },
        group: {
          id: req.params.groupId,
        },
        membership: 'member',
      },
      relations: ['musician', 'group'],
    });

    if (!musicianGroup) {
      return res.status(404).json({ msg: 'E_MUSICIAN_NOT_MEMBER' });
    }

    await musicianGroupRepository.remove(musicianGroup);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
