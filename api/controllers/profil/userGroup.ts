import { getRepository } from 'typeorm';
import { Groups, MusicianGroup } from '../../entity';
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
      },
      relations: [
        'musician',
        'group',
        'group.members',
        'group.members.musician',
        'group.members.group',
        'group.members.instruments',
      ],
    });

    if (!musicianGroup) {
      return res.status(404).json({ msg: 'E_MUSICIAN_NOT_IN_THE_GROUP' });
    }

    if (musicianGroup.membership === 'admin') {
      /**
       * Contains all the musician who are in the group
       * as **member** or **lite_admin** expect the one making
       * the request
       */

      const otherMembers = musicianGroup.group.members.filter(
        (musicianGroup) => musicianGroup.musician.id !== req.userId,
      );

      if (otherMembers.length === 0) {
        await getRepository(Groups).remove(musicianGroup.group);

        return res.sendStatus(200);
      } else {
        if (otherMembers.length == 1) {
          const newAdmin = otherMembers[0];
          newAdmin.membership = 'admin';

          musicianGroupRepository.save(newAdmin);
        } else {
          /**
           * The admin has to pass the new admin userId
           * in the body request
           */
          if (!req.body.musicianId) {
            return res.status(400).json({ msg: 'E_BODY_IS_REQUIRED' });
          }

          const newAdmin = otherMembers.filter(
            ({ musician: { id } }) => id == req.body.musicianId,
          );

          if (newAdmin.length === 0) {
            return res
              .status(404)
              .json({ msg: 'E_NEW_ADMIN_NOT_IN_THE_GROUP' });
          }

          newAdmin[0].membership = 'admin';

          await musicianGroupRepository.save(newAdmin[0]);
        }
      }
    }

    await musicianGroupRepository.remove(musicianGroup);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
