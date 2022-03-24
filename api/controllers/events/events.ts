import {
  DeepPartial,
  FindOneOptions,
  getRepository,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import {
  Event,
  EventDeletedNotification,
  Genre,
  Groups,
  Musician,
} from '../../entity';
import type core from 'express-serve-static-core';
import type {
  getHTTPCode,
  getResponsesBody,
  getRequestBody,
  getPathParams,
  getRequestQuery,
} from '@typing';
import type { operations } from '@schema';
import type { NextFunction } from 'express';

type GetEvents = operations['getEvents'];
type PostEvents = operations['postEvents'];
type GetEventsById = operations['getEventById'];
type PatchEventsById = operations['patchEventById'];
type DeleteEventsById = operations['deleteEventById'];

export const getAllEvents = async (
  req: core.Request<
    {},
    getResponsesBody<GetEvents>,
    getRequestBody<GetEvents>,
    getRequestQuery<GetEvents>
  >,
  res: core.Response<getResponsesBody<GetEvents>, {}, getHTTPCode<GetEvents>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<GetEvents>, {}, getHTTPCode<GetEvents>>
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
    const genresFilter = req.query.genres;
    const startDateFilter = req.query.startdate;
    const endDateFilter = req.query.enddate;

    const commonFilter: FindOneOptions<Musician>['where'] = {};
    const queryFilter: FindOneOptions<Musician>['where'] = [];

    if (nameFilter) commonFilter['name'] = ILike(nameFilter);

    /**
     * The condition for the date is : startDate >= startDateFilter OR endDate <= endDateFitlter
     */
    if (startDateFilter && endDateFilter) {
      // see https://github.com/typeorm/typeorm/issues/2929
      queryFilter.push(
        {
          startDate: MoreThanOrEqual(startDateFilter),
          ...commonFilter,
        },
        {
          endDate: LessThanOrEqual(endDateFilter),
          ...commonFilter,
        },
      );
    } else if (startDateFilter) {
      queryFilter.push({
        startDate: MoreThanOrEqual(startDateFilter),
        ...commonFilter,
      });
    } else if (endDateFilter) {
      queryFilter.push({
        endDate: LessThanOrEqual(endDateFilter),
        ...commonFilter,
      });
    } else {
      queryFilter.push(commonFilter);
    }

    let joinQuery = '';
    let joinValue = {};
    if (genresFilter) {
      joinQuery = 'genres.name = ANY(:genres)';
      joinValue = { genres: genresFilter };
    }

    const [events, count] = await getRepository(Event).findAndCount({
      join: {
        alias: 'event',
        innerJoin: {
          groups: 'event.groups',
          genres: 'event.genres',
        },
      },
      where: (qb) => {
        if (joinQuery == '') {
          qb.where(queryFilter).andWhere({});
        } else {
          qb.where(queryFilter).andWhere(joinQuery, joinValue);
        }
      },
      relations: ['genres', 'groups', 'admins', 'groups.genres'],
      skip: start,
      take: limit,
    });

    const _links: Pick<
      Extract<getResponsesBody<GetEvents>, { limit: number }>,
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
      results: events,
      size: events.length,
      limit,
      start,
      total: count,
      ..._links,
    });
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (
  req: core.Request<
    getPathParams<GetEventsById>,
    getResponsesBody<GetEventsById>,
    getRequestBody<GetEventsById>,
    getPathParams<GetEventsById>
  >,
  res: core.Response<
    getResponsesBody<GetEventsById>,
    {},
    getHTTPCode<GetEventsById>
  >,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<GetEventsById>, {}, getHTTPCode<GetEventsById>>
> => {
  try {
    const event = await getRepository(Event).findOne({
      where: { id: req.params.eventId },
      relations: ['genres', 'groups', 'admins', 'groups.genres'],
    });

    if (!event) {
      return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
    }

    return res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (
  req: core.Request<
    {},
    getResponsesBody<PostEvents>,
    getRequestBody<PostEvents>,
    getPathParams<PostEvents>
  >,
  res: core.Response<getResponsesBody<PostEvents>, {}, getHTTPCode<PostEvents>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<PostEvents>, {}, getHTTPCode<PostEvents>>
> => {
  try {
    const eventRepository = getRepository(Event);

    const { name, description, startDate, endDate, adress, genres } = req.body;

    const admin = await getRepository(Musician).findOne({ id: req.userId });

    const evtGenres: Genre[] = [];
    for (let i = 0; i < genres.length; i++) {
      evtGenres.push(
        await getRepository(Genre).findOne({ name: genres[i].name }),
      );
    }

    const newEvent = eventRepository.create({
      name,
      description,
      startDate,
      endDate,
      adress,
      admins: [admin],
      genres: evtGenres,
      groups: [],
    });

    await eventRepository.save(newEvent);

    return res.status(201).json(newEvent);
  } catch (err) {
    if (err.code == 23505) {
      return res.status(409).json({ msg: 'E_EVENT_ALREADY_EXIST' });
    } else {
      next(err);
    }
  }
};

export const modifyEventById = async (
  req: core.Request<
    getPathParams<PatchEventsById>,
    getResponsesBody<PatchEventsById>,
    getRequestBody<PatchEventsById>,
    getPathParams<PatchEventsById>
  >,
  res: core.Response<
    getResponsesBody<PatchEventsById>,
    {},
    getHTTPCode<PatchEventsById>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<PatchEventsById>,
    {},
    getHTTPCode<PatchEventsById>
  >
> => {
  try {
    const event = await getRepository(Event).findOne({
      where: { id: req.params.eventId },
      relations: ['admins'],
    });

    if (event.admins.length === 0) {
      return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
    }

    if (!event.admins.some((musician) => musician.id === req.userId)) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const { genres, ...basicInfo } = req.body;
    const update: DeepPartial<Event> = { ...basicInfo };
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

    await getRepository(Event).save({ id: req.params.eventId, ...update });
    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const deleteEventById = async (
  req: core.Request<
    getPathParams<DeleteEventsById>,
    getResponsesBody<DeleteEventsById>,
    getRequestBody<DeleteEventsById>,
    getPathParams<DeleteEventsById>
  >,
  res: core.Response<
    getResponsesBody<DeleteEventsById>,
    {},
    getHTTPCode<DeleteEventsById>
  >,
  next: NextFunction,
): Promise<
  core.Response<
    getResponsesBody<DeleteEventsById>,
    {},
    getHTTPCode<DeleteEventsById>
  >
> => {
  try {
    const event = await getRepository(Event).findOne({
      where: { id: req.params.eventId },
      relations: [
        'admins',
        'groups',
        'groups.members',
        'groups.members.musician',
      ],
    });

    if (event.admins.length === 0) {
      return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
    }

    if (!event.admins.some((musician) => musician.id === req.userId)) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    // await getRepository(Event).delete({ id: req.params.eventId });

    const members: Musician[] = [];

    event.groups.forEach((group) => {
      group.members.forEach((member) => {
        members.push(member.musician);
      });
    });

    const membersSet = members.reduce((acc, current) => {
      const x = acc.find((item) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as Musician[]);

    const notifications = membersSet.map((member) =>
      getRepository(EventDeletedNotification).create({
        musician: member,
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        adress: event.adress,
        genres: event.genres,
      }),
    );

    await getRepository(EventDeletedNotification).save(notifications);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
