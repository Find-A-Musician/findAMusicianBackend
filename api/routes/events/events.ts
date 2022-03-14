import express from 'express';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getResponsesBody,
  getRequestBody,
  getPathParams,
  getRequestQuery,
} from '@typing';
import type core from 'express-serve-static-core';
import {
  DeepPartial,
  FindOneOptions,
  getRepository,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import eventsAdminsRouter from './admins';
import { Event, Genre, Musician } from '../../entity';

const router = express.Router();

type GetEvents = operations['getEvents'];
type PostEvents = operations['postEvents'];
type GetEventsById = operations['getEventById'];
type PatchEventsById = operations['patchEventById'];
type DeleteEventsById = operations['deleteEventById'];

router.use('/admins', eventsAdminsRouter);

router.get(
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<GetEvents>,
      getRequestBody<GetEvents>,
      getRequestQuery<GetEvents>
    >,
    res: core.Response<getResponsesBody<GetEvents>, {}, getHTTPCode<GetEvents>>,
  ) => {
    try {
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
      }

      let joinQuery = '';
      let joinValue = {};
      if (genresFilter) {
        joinQuery = 'genres.name = ANY(:genres)';
        joinValue = { genres: genresFilter };
      }

      const events = await getRepository(Event).find({
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
        relations: ['genres', 'groups', 'admins'],
      });

      return res.status(200).json(events);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.get(
  '/:eventId',
  async (
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
  ) => {
    try {
      const event = await getRepository(Event).findOne({
        where: { id: req.params.eventId },
        relations: ['genres', 'groups', 'admins'],
      });

      if (!event) {
        return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
      }

      return res.status(200).json(event);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.post(
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<PostEvents>,
      getRequestBody<PostEvents>,
      getPathParams<PostEvents>
    >,
    res: core.Response<
      getResponsesBody<PostEvents>,
      {},
      getHTTPCode<PostEvents>
    >,
  ) => {
    try {
      const eventRepository = getRepository(Event);

      const { name, description, startDate, endDate, adress, genres } =
        req.body;

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
      });

      await eventRepository.save(newEvent);

      return res.status(201).json(newEvent);
    } catch (err) {
      if (err.constraint === 'events_name_key') {
        return res.status(401).json({ msg: 'E_EVENT_NAME_ALREADY_TAKEN' });
      } else {
        return res
          .status(500)
          .json({ msg: 'E_SQL_ERR', stack: JSON.stringify(err) });
      }
    }
  },
);

router.patch(
  '/:eventId',
  async (
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
  ) => {
    try {
      const { admins } = await getRepository(Event).findOne({
        where: { id: req.params.eventId },
        relations: ['admins'],
      });

      if (admins.length === 0) {
        return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
      }

      if (!admins.some((musician) => musician.id === req.userId)) {
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
      console.log(err);

      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.delete(
  '/:eventId',
  async (
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
  ) => {
    try {
      const { admins } = await getRepository(Event).findOne({
        where: { id: req.params.eventId },
        relations: ['admins'],
      });

      if (admins.length === 0) {
        return res.status(404).json({ msg: 'E_EVENT_DOES_NOT_EXIST' });
      }

      if (!admins.some((musician) => musician.id === req.userId)) {
        return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
      }

      await getRepository(Event).delete({ id: req.params.eventId });
      return res.sendStatus(200);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
