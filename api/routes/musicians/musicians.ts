import express from 'express';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getResponsesBody,
  getRequestQuery,
} from '@typing';
import { getRepository, ILike, FindOneOptions, Any } from 'typeorm';
import { Musician } from '../../entity';

type GetMusician = operations['getMusicians'];
type GetMusicianById = operations['getMusicianById'];
const router = express.Router();

router.get(
  '/',
  async (
    req: Request<
      {},
      getResponsesBody<GetMusician>,
      {},
      getRequestQuery<GetMusician>
    >,
    res: core.Response<
      getResponsesBody<GetMusician>,
      {},
      getHTTPCode<GetMusician>
    >,
  ) => {
    try {
      // Pagination
      const start =
        req.query.start !== undefined || req.query.start !== null
          ? req.query.start
          : 0;
      const limit =
        req.query.limit !== undefined || req.query.limit !== null
          ? req.query.limit
          : 20;
      const baseURL = req.protocol + '://' + req.headers.host + '/';
      const reqUrl = new URL(req.originalUrl, baseURL);
      const url = reqUrl.origin + reqUrl.pathname;

      // Filters
      const nameFilter = req.query.name ? `%${req.query.name}%` : null;
      const genresFilter = req.query.genres;
      const instrumentsFilter = req.query.instruments;
      const locationFilter = req.query.location;
      const promotionFilter = req.query.promotion;

      const commonFilter: FindOneOptions<Musician>['where'] = {};
      const queryFilter: FindOneOptions<Musician>['where'] = [];

      if (locationFilter) commonFilter.location = Any(locationFilter);
      if (promotionFilter) commonFilter.promotion = Any(promotionFilter);

      if (nameFilter) {
        // see https://github.com/typeorm/typeorm/issues/2929
        queryFilter.push(
          {
            givenName: ILike(nameFilter),
            ...commonFilter,
          },
          {
            familyName: ILike(nameFilter),
            ...commonFilter,
          },
        );
      } else {
        queryFilter.push(commonFilter);
      }

      // The where clause for the where of the join tables : genres and instruments
      let joinQuery = '';
      let joinValue = {};
      if (instrumentsFilter && genresFilter) {
        joinQuery =
          'instruments.name = ANY(:instruments) AND genres.name = ANY(:genres)';
        joinValue = { instruments: instrumentsFilter, genres: genresFilter };
      } else if (instrumentsFilter) {
        joinQuery = 'instruments.name = ANY(:instruments)';
        joinValue = { instruments: instrumentsFilter };
      } else if (genresFilter) {
        joinQuery = 'genres.name = ANY(:genres)';
        joinValue = { genres: genresFilter };
      }

      // This is a work around to make where clause on relation, see : https://github.com/typeorm/typeorm/issues/4396
      const [musicians, count] = await getRepository(Musician).findAndCount({
        join: {
          alias: 'musician',
          innerJoin: {
            instruments: 'musician.instruments',
            genres: 'musician.genres',
          },
        },
        where: (qb) => {
          if (joinQuery == '') {
            qb.where(queryFilter);
          } else {
            qb.where(queryFilter).andWhere(joinQuery, joinValue);
          }
        },
        take: limit,
        skip: start,
        relations: ['instruments', 'genres'],
      });

      const _links: Pick<
        Extract<getResponsesBody<GetMusician>, { limit: number }>,
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
          _links._links.previous = `${url}?start=${
            start - limit
          }&limit=${limit}`;
        }
      }

      if (start + limit < count) {
        _links._links.next = `${url}?start=${start + limit}&limit=${limit}`;
      }

      return res.status(200).json({
        results: musicians,
        size: musicians.length,
        limit,
        start,
        total: count,
        ..._links,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.get(
  '/:musicianId',
  async (
    req: Request<
      getPathParams<GetMusicianById>,
      getResponsesBody<GetMusicianById>,
      getRequestBody<GetMusicianById>,
      {}
    >,
    res: core.Response<
      getResponsesBody<GetMusicianById>,
      {},
      getHTTPCode<GetMusicianById>
    >,
  ) => {
    try {
      const musician = await getRepository(Musician).findOne({
        where: { id: req.params.musicianId },
        relations: ['instruments', 'genres'],
      });

      if (!musician) {
        return res.status(404).json({ msg: 'E_UNFOUND_USER' });
      }

      res.status(200).json(musician);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
