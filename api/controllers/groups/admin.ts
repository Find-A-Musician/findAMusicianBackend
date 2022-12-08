import { getConnection, getRepository } from 'typeorm';
import { MusicianGroup, MembershipNotification } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';
import type { FindConditions } from 'typeorm';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getResponsesBody,
} from '@typing';
import type { NextFunction } from 'express';

type AddGroupLiteAdmins = operations['addGroupLiteAdmins'];
type AddGroupLiteAdmin = operations['addGroupLiteAdmin'];
type RemoveGroupLiteAdmin = operations['removeGroupLiteAdmin'];
type TransferGroupAdmin = operations['transferGroupAdmin'];

export const addGroupLiteAdmins = async (
  req: Request<
    getPathParams<AddGroupLiteAdmins>,
    getResponsesBody<AddGroupLiteAdmins>,
    getRequestBody<AddGroupLiteAdmins>,
    {}
  >,
  res: core.Response<
    getResponsesBody<AddGroupLiteAdmins>,
    {},
    getHTTPCode<AddGroupLiteAdmins>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<AddGroupLiteAdmins>,
    {},
    getHTTPCode<AddGroupLiteAdmins>
  >
> => {
  try {
    const connexion = getConnection();
    const new_lite_admins_id = req.body.lite_admins;
    const groupId = req.params.groupId;

    const admin = await getRepository(MusicianGroup).findOne({
      where: {
        musician: {
          id: req.userId,
        },
        group: {
          id: groupId,
        },
        membership: 'admin',
      },
      relations: ['musician', 'group'],
    });

    if (!admin) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const lite_admins = await getRepository(MusicianGroup).find({
      where: { group: { id: groupId }, membership: 'lite_admin' },
      relations: ['musician'],
    });

    await connexion.manager.transaction(async (entityManager) => {
      for (let i = 0; i < new_lite_admins_id.length; i++) {
        const musicianToMakeLiteAdmin = await entityManager.findOne(
          MusicianGroup,
          {
            where: {
              musician: {
                id: new_lite_admins_id[i],
              },
              group: {
                id: groupId,
              },
            },
          },
        );

        if (!musicianToMakeLiteAdmin) {
          const err = new Error(`E_MUSICIAN_NOT_MEMBER`);
          err['musicianId'] = new_lite_admins_id[i];
          err['name'] = 'E_MUSICIAN_NOT_MEMBER';
          throw err;
        }

        musicianToMakeLiteAdmin.membership = 'lite_admin';
        await entityManager.update(
          MusicianGroup,
          {
            musician: {
              id: new_lite_admins_id[i],
            },
            group: {
              id: groupId,
            },
          },
          {
            membership: 'lite_admin',
          },
        );

        const notification = getRepository(MembershipNotification).create({
          musician: {
            id: new_lite_admins_id[i],
          },
          group: { id: groupId },
          membership: 'lite_admin',
        });

        await getRepository(MembershipNotification).save(notification);
      }

      for (let i = 0; i < lite_admins.length; i++) {
        if (!new_lite_admins_id.includes(lite_admins[i].musician.id)) {
          await getRepository(MusicianGroup).update(
            {
              musician: {
                id: lite_admins[i].musician.id,
              },
              group: {
                id: groupId,
              },
            },
            {
              membership: 'member',
            },
          );

          const notification = getRepository(MembershipNotification).create({
            musician: lite_admins[i].musician,
            group: { id: groupId },
            membership: 'member',
          });

          await getRepository(MembershipNotification).save(notification);
        }
      }
    });

    return res.sendStatus(204);
  } catch (err) {
    if (err.name == 'E_MUSICIAN_NOT_MEMBER') {
      return res
        .status(404)
        .json({ msg: `E_MUSICIAN_NOT_MEMBER`, stack: err.musicianId });
    }

    next(err);
  }
};

export const addGroupLiteAdminById = async (
  req: Request<
    getPathParams<AddGroupLiteAdmin>,
    getResponsesBody<AddGroupLiteAdmin>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<AddGroupLiteAdmin>,
    {},
    getHTTPCode<AddGroupLiteAdmin>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<AddGroupLiteAdmin>,
    {},
    getHTTPCode<AddGroupLiteAdmin>
  >
> => {
  try {
    const musicianGroupRepository = getRepository(MusicianGroup);

    const musicianIdToMakeLiteAdmin = req.params.musicianId;
    const groupId = req.params.groupId;

    const admin = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: req.userId,
        },
        group: {
          id: groupId,
        },
        membership: 'admin',
      },
      relations: ['musician', 'group'],
    });

    if (!admin) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const musicianToMakeLiteAdmin = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: musicianIdToMakeLiteAdmin,
        },
        group: {
          id: groupId,
        },
        membership: 'member',
      },
      relations: ['musician', 'group'],
    });

    if (!musicianToMakeLiteAdmin) {
      return res.status(404).json({ msg: 'E_MUSICIAN_NOT_MEMBER' });
    }

    musicianToMakeLiteAdmin.membership = 'lite_admin';

    await musicianGroupRepository.save(musicianToMakeLiteAdmin);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const removeGroupLiteAdminById = async (
  req: Request<
    getPathParams<RemoveGroupLiteAdmin>,
    getResponsesBody<RemoveGroupLiteAdmin>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<RemoveGroupLiteAdmin>,
    {},
    getHTTPCode<RemoveGroupLiteAdmin>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<RemoveGroupLiteAdmin>,
    {},
    getHTTPCode<RemoveGroupLiteAdmin>
  >
> => {
  try {
    const musicianGroupRepository = getRepository(MusicianGroup);

    const musicianIdToRemoveLiteAdmin = req.params.musicianId;
    const groupId = req.params.groupId;

    const admin = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: req.userId,
        },
        group: {
          id: groupId,
        },
        membership: 'admin',
      },
      relations: ['musician', 'group'],
    });

    if (!admin) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const musicianToRemoveLiteAdmin = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: musicianIdToRemoveLiteAdmin,
        },
        group: {
          id: groupId,
        },
        membership: 'lite_admin',
      },
      relations: ['musician', 'group'],
    });

    if (!musicianToRemoveLiteAdmin) {
      return res.status(404).json({ msg: 'E_MUSICIAN_NOT_LITE_ADMIN' });
    }

    musicianToRemoveLiteAdmin.membership = 'member';

    await musicianGroupRepository.save(musicianToRemoveLiteAdmin);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const transferGroupAdmin = async (
  req: Request<
    getPathParams<TransferGroupAdmin>,
    getResponsesBody<TransferGroupAdmin>,
    {},
    {}
  >,
  res: core.Response<
    getResponsesBody<TransferGroupAdmin>,
    {},
    getHTTPCode<TransferGroupAdmin>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<TransferGroupAdmin>,
    {},
    getHTTPCode<TransferGroupAdmin>
  >
> => {
  try {
    const musicianGroupRepository = getRepository(MusicianGroup);

    const musicianIdToTransferAdmin = req.params.musicianId;
    const groupId = req.params.groupId;

    const admin = await musicianGroupRepository.findOne({
      where: {
        musician: {
          id: req.userId,
        },
        group: {
          id: groupId,
        },
        membership: 'admin',
      },
      relations: ['musician', 'group'],
    });

    if (!admin) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const query: FindConditions<MusicianGroup> = {
      musician: {
        id: musicianIdToTransferAdmin,
      },
      group: {
        id: groupId,
      },
    };

    const musicianToTransferAdmin = await musicianGroupRepository.findOne({
      where: [
        {
          ...query,
          membership: 'lite_admin',
        },
        {
          ...query,
          membership: 'member',
        },
      ],
      relations: ['musician', 'group'],
    });

    if (!musicianToTransferAdmin) {
      return res
        .status(404)
        .json({ msg: 'E_MUSICIAN_NOT_LITE_ADMIN_OR_MEMBER' });
    }

    musicianToTransferAdmin.membership = 'admin';
    admin.membership = 'lite_admin';

    await musicianGroupRepository.save([musicianToTransferAdmin, admin]);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
