import express from 'express';
import invitationRouter from './groupInvitation';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getResponsesBody,
} from '@typing';

import { DeepPartial, getRepository } from 'typeorm';
import { Band, Musician, MusicianBand, Genre, Instrument } from '../../entity';
import type core from 'express-serve-static-core';
import type { Request } from 'express';

type GetGroups = operations['getGroups'];
type GetGroupsById = operations['getGroupsById'];
type PostGroups = operations['createGroup'];
type PatchGroupsById = operations['patchGroupsById'];
type DeleteGroupsById = operations['deleteGroupsById'];

const router = express.Router();

router.use('/invitation', invitationRouter);

router.get(
  '/',
  async (
    req: Request<{}, getResponsesBody<GetGroups>, {}, {}>,
    res: core.Response<getResponsesBody<GetGroups>, {}, getHTTPCode<GetGroups>>,
  ) => {
    try {
      const groups = await getRepository(Band).find({
        relations: [
          'members',
          'genres',
          'members.musician',
          'members.musician.instruments',
          'members.musician.genres',
        ],
      });

      return res.status(200).json(groups);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERR', stack: JSON.stringify(err) });
    }
  },
);

router.get(
  '/:groupId',
  async (
    req: Request<
      getPathParams<GetGroupsById>,
      getResponsesBody<GetGroupsById>,
      getRequestBody<GetGroupsById>,
      {}
    >,
    res: core.Response<
      getResponsesBody<GetGroupsById>,
      {},
      getHTTPCode<GetGroupsById>
    >,
  ) => {
    try {
      const group = await getRepository(Band).findOne({
        where: { id: req.params.groupId },
        relations: [
          'members',
          'genres',
          'members.musician',
          'members.musician.instruments',
          'members.musician.genres',
        ],
      });

      if (!group) {
        return res.status(404).json({ msg: 'E_UNFOUND_GROUP' });
      }

      return res.status(200).json(group);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

/**
 * This post create a new Band entity and create a new MusicianBand
 * entity with the req.userId as the admin of the new group created
 */
router.post(
  '/',
  async (
    req: Request<
      {},
      getResponsesBody<PostGroups>,
      getRequestBody<PostGroups>,
      {}
    >,
    res: core.Response<
      getResponsesBody<PostGroups>,
      {},
      getHTTPCode<PostGroups>
    >,
  ) => {
    try {
      const {
        body: { group, instruments },
      } = req;

      // Create the new group entity and save it
      const newGroup = new Band();
      newGroup.name = group.name;
      newGroup.description = group.description;
      newGroup.location = group.location;

      const groupGenres: Genre[] = [];
      for (let i = 0; i < group.genres.length; i++) {
        groupGenres.push(
          await getRepository(Genre).findOne({ name: group.genres[i].name }),
        );
      }
      newGroup.genres = groupGenres;

      await getRepository(Band).save(newGroup);

      // Save the req userId as the admin of this new Group
      const musician = await getRepository(Musician).findOne({
        id: req.userId,
      });

      const musicianGroupInstruments: Instrument[] = [];
      for (let i = 0; i < instruments.length; i++) {
        musicianGroupInstruments.push(
          await getRepository(Instrument).findOne({
            name: instruments[i].name,
          }),
        );
      }

      const musicianBand = new MusicianBand();
      musicianBand.musician = musician;
      musicianBand.group = newGroup;
      musicianBand.instruments = musicianGroupInstruments;
      musicianBand.membership = 'admin';
      await getRepository(MusicianBand).save(musicianBand);

      return res.sendStatus(201);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.patch(
  '/:groupId',
  async (
    req: Request<
      getPathParams<PatchGroupsById>,
      getResponsesBody<PatchGroupsById>,
      getRequestBody<PatchGroupsById>,
      {}
    >,
    res: core.Response<
      getResponsesBody<PatchGroupsById>,
      {},
      getHTTPCode<PatchGroupsById>
    >,
  ) => {
    try {
      const group = await getRepository(Band).findOne({
        id: req.params.groupId,
      });

      if (!group) {
        return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
      }

      const { membership } = await getRepository(MusicianBand).findOne({
        where: {
          musician: {
            id: req.userId,
          },
          group: {
            id: req.params.groupId,
          },
        },
      });

      if (!(membership == 'admin')) {
        return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
      }

      const { genres, ...basicInfo } = req.body;
      const update: DeepPartial<Band> = { ...basicInfo };
      const newGenres: Genre[] = [];
      if (genres) {
        for (let i = 0; i < genres.length; i++) {
          newGenres.push(
            await getRepository(Genre).findOne({
              name: genres[i].name,
            }),
          );
        }

        update['genres'] = newGenres;
      }

      await getRepository(Band).save({ id: req.params.groupId, ...update });

      return res.sendStatus(200);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.delete(
  '/:groupId',
  async (
    req: Request<
      getPathParams<DeleteGroupsById>,
      getResponsesBody<DeleteGroupsById>,
      getRequestBody<DeleteGroupsById>,
      {}
    >,
    res: core.Response<
      getResponsesBody<DeleteGroupsById>,
      {},
      getHTTPCode<DeleteGroupsById>
    >,
  ) => {
    try {
      const group = await getRepository(Band).findOne({
        id: req.params.groupId,
      });

      if (!group) {
        return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
      }

      const { membership } = await getRepository(MusicianBand).findOne({
        where: {
          musician: {
            id: req.userId,
          },
          group: {
            id: req.params.groupId,
          },
        },
      });

      if (!(membership == 'admin')) {
        return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
      }

      await getRepository(Band).delete({ id: req.params.groupId });
      res.sendStatus(200);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
