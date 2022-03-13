import express from 'express';
import invitationRouter from './groupInvitation';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getRequestQuery,
  getResponsesBody,
} from '@typing';

import {
  Any,
  DeepPartial,
  FindOneOptions,
  getRepository,
  ILike,
} from 'typeorm';
import {
  Groups,
  Musician,
  MusicianGroup,
  Genre,
  Instrument,
} from '../../entity';
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
    req: Request<
      {},
      getResponsesBody<GetGroups>,
      {},
      getRequestQuery<GetGroups>
    >,
    res: core.Response<getResponsesBody<GetGroups>, {}, getHTTPCode<GetGroups>>,
  ) => {
    try {
      const nameFilter = req.query.name ? `%${req.query.name}%` : null;
      const locationFilter = req.query.location;
      const genresFilter = req.query.genres;

      const commonFilter: FindOneOptions<Groups>['where'] = {};

      if (locationFilter) commonFilter.location = Any(locationFilter);
      if (nameFilter) commonFilter.name = ILike(nameFilter);

      let joinQuery = '';
      let joinValue = {};
      if (genresFilter) {
        joinQuery = 'genres.name = ANY(:genres)';
        joinValue = { genres: genresFilter };
      }

      const groups = await getRepository(Groups).find({
        join: {
          alias: 'group',
          innerJoin: {
            genres: 'group.genres',
            members: 'group.members',
          },
        },
        where: (qb) => {
          if (joinQuery == '') {
            qb.where(commonFilter);
          } else {
            qb.where(commonFilter).andWhere(joinQuery, joinValue);
          }
        },
        relations: ['genres', 'members', 'members.musician'],
      });

      return res.status(200).json(groups);
    } catch (err) {
      console.log(err);
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
      const group = await getRepository(Groups).findOne({
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
      const groupRepository = getRepository(Groups);
      const musicianGroupRepository = getRepository(MusicianGroup);
      const {
        body: {
          group: { name, description, location, genres: groupGenre },
          instruments,
        },
      } = req;

      const genres: Genre[] = [];
      for (let i = 0; i < groupGenre.length; i++) {
        genres.push(
          await getRepository(Genre).findOne({
            name: groupGenre[i].name,
          }),
        );
      }
      // Create the new group entity and save it
      const newGroup = groupRepository.create({
        name,
        description,
        location,
        genres,
      });

      await groupRepository.save(newGroup);

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

      const musicianGroup = musicianGroupRepository.create({
        musician,
        group: newGroup,
        instruments: musicianGroupInstruments,
        membership: 'admin',
      });

      await musicianGroupRepository.save(musicianGroup);

      return res.sendStatus(201);
    } catch (err) {
      if (err.code == 23505) {
        res.status(409).json({ msg: 'E_GROUP_ALREADY_EXIST' });
      }

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
      const group = await getRepository(Groups).findOne({
        id: req.params.groupId,
      });

      if (!group) {
        return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
      }

      const { membership } = await getRepository(MusicianGroup).findOne({
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
      const update: DeepPartial<Groups> = { ...basicInfo };
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

      await getRepository(Groups).save({ id: req.params.groupId, ...update });

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
      const group = await getRepository(Groups).findOne({
        id: req.params.groupId,
      });

      if (!group) {
        return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
      }

      const { membership } = await getRepository(MusicianGroup).findOne({
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

      await getRepository(Groups).delete({ id: req.params.groupId });
      res.sendStatus(200);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
