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

export const getAllGroup = async (
  req: Request<{}, getResponsesBody<GetGroups>, {}, getRequestQuery<GetGroups>>,
  res: core.Response<getResponsesBody<GetGroups>, {}, getHTTPCode<GetGroups>>,
): Promise<
  core.Response<getResponsesBody<GetGroups>, {}, getHTTPCode<GetGroups>>
> => {
  try {
    // Pagination
    const start =
      req.query.start !== undefined && req.query.start !== null
        ? req.query.start
        : 0;
    const limit =
      req.query.limit !== undefined && req.query.limit !== null
        ? req.query.limit
        : 20;
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    const reqUrl = new URL(req.originalUrl, baseURL);
    const url = reqUrl.origin + reqUrl.pathname;

    // Filters
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

    const [groups, count] = await getRepository(Groups).findAndCount({
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
      skip: start,
      take: limit,
    });

    const _links: Pick<
      Extract<getResponsesBody<GetGroups>, { limit: number }>,
      '_links'
    > = {
      _links: {
        self: url,
        first: `${url}?start=0&limit=${limit}`,
      },
    };

    if (start != 0) {
      if (start < limit) {
        _links._links.previous = `${url}?start=0&limit=${limit}`;
      } else {
        _links._links.previous = `${url}?start=${start - limit}&limit=${limit}`;
      }
    }

    if (start + limit < count) {
      _links._links.next = `${url}?start=${start + limit}&limit=${limit}`;
    }

    return res.status(200).json({
      results: groups,
      size: groups.length,
      limit,
      start,
      total: count,
      ..._links,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: 'E_SQL_ERR', stack: JSON.stringify(err) });
  }
};

export const getGroupById = async (
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
): Promise<
  core.Response<getResponsesBody<GetGroupsById>, {}, getHTTPCode<GetGroupsById>>
> => {
  try {
    const group = await getRepository(Groups).findOne({
      where: { id: req.params.groupId },
      relations: ['members', 'genres', 'members.musician'],
    });

    if (!group) {
      return res.status(404).json({ msg: 'E_UNFOUND_GROUP' });
    }

    return res.status(200).json(group);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};

/**
 * This post create a new Band entity and create a new MusicianBand
 * entity with the req.userId as the admin of the new group created
 */
export const createGroup = async (
  req: Request<
    {},
    getResponsesBody<PostGroups>,
    getRequestBody<PostGroups>,
    {}
  >,
  res: core.Response<getResponsesBody<PostGroups>, {}, getHTTPCode<PostGroups>>,
): Promise<
  core.Response<getResponsesBody<PostGroups>, {}, getHTTPCode<PostGroups>>
> => {
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

    return res.status(201).json({ members: [musician], ...newGroup });
  } catch (err) {
    if (err.code == 23505) {
      res.status(409).json({ msg: 'E_GROUP_ALREADY_EXIST' });
    }

    return res
      .status(500)
      .json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};

export const modifyGroupById = async (
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
): Promise<
  core.Response<
    getResponsesBody<PatchGroupsById>,
    {},
    getHTTPCode<PatchGroupsById>
  >
> => {
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
      .json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};

export const deleteGroupById = async (
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
): Promise<
  core.Response<
    getResponsesBody<DeleteGroupsById>,
    {},
    getHTTPCode<DeleteGroupsById>
  >
> => {
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
      .json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};
