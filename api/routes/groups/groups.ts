import pg from '../../postgres';
import sql from 'sql-template-strings';
import express from 'express';
import { v4 as uuidV4 } from 'uuid';
import invitationRouter from './groupInvitation';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getPathParams,
  getRequestBody,
  getResponsesBody,
} from '@typing';
import type core from 'express-serve-static-core';
import type { Request } from 'express';

type GetGroups = operations['getGroups'];
type PostGroups = operations['createGroup'];
type GetGroupsById = operations['getGroupsById'];
type PatchGroupsById = operations['patchGroupsById'];
type DeleteGroupsById = operations['deleteGroupsById'];

const router = express.Router();

router.use('/invitation', invitationRouter);
//return a list of all the groups registered

router.get(
  '/',
  async (
    req: Request<{}, getResponsesBody<GetGroups>, {}, {}>,
    res: core.Response<getResponsesBody<GetGroups>, {}, getHTTPCode<GetGroups>>,
  ) => {
    const response: getResponsesBody<GetGroups> = [];
    try {
      // Get all the groups and their information
      const { rows: groups } = await pg.query(sql`
            SELECT * FROM groups
        `);

      // Assigning each groupInformation key/values
      groups.forEach((group, index) => {
        response[index] = {
          groupInformation: group,
          groupMembers: [],
        };
      });

      //get each genre for each group
      for (let index = 0; index < groups.length; index++) {
        const { rows: genres } = await pg.query(sql`
            SELECT genres.* FROM genres
            INNER JOIN groups_genres
            ON groups_genres.genre=genres.id
            WHERE groups_genres."group"=${groups[index].id}
        `);
        response[index].groupInformation.genre = genres;
      }

      //get every musicians of each group
      for (let index = 0; index < groups.length; index++) {
        const { rows: groupMembers } = await pg.query(sql`
            SELECT given_name, family_name, instruments.name as instrument, role, membership
            FROM groups_musicians
            INNER JOIN musicians 
              ON musicians.id = groups_musicians.musician
            INNER JOIN instruments 
              ON groups_musicians.instrument = instruments.id
            WHERE groups_musicians."group"=${groups[index].id}
          `);
        response[index].groupMembers = groupMembers;
      }
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ msg: 'E_SQL_ERR', stack: err });
    }
  },
);

// create a new group

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
      const groupId = uuidV4();

      try {
        await pg.query(sql`
      INSERT INTO groups (
        id,
        name,
        description,
        location
      ) VALUES (
        ${groupId},
        ${req.body.group.name},
        ${req.body.group.description},
        ${req.body.group.location}
      )
    `);
      } catch (err) {
        return res.status(422).json({ msg: 'E_GROUP_NAME_ALREADY_TAKEN' });
      }

      for (let index = 0; index < req.body.group.genre.length; index++) {
        await pg.query(sql`
          INSERT INTO groups_genres (
            "group",
            genre
          ) VALUES (
            ${groupId},
            ${req.body.group.genre[index].id}
          )
        `);
      }

      await pg.query(sql`
        INSERT INTO groups_musicians (
          "group",
          musician,
          instrument,
          membership,
          role
        ) VALUES (
          ${groupId},
          ${req.userId},
          ${req.body.instrument.id},
          'member',
          'admin'
        )
      `);

      return res.sendStatus(201);
    } catch (err) {
      return res.status(500).json({ msg: 'E_SQL_ERROR', stack: err });
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
    const response = {
      groupInformation: {},
      groupMembers: [],
    };
    try {
      const { rows: groups } = await pg.query(sql`
          SELECT * FROM groups
          WHERE id = ${req.params.groupId}
      `);

      if (groups.length === 0) {
        return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
      }

      response.groupInformation = groups[0];

      const { rows: genres } = await pg.query(sql`
          SELECT genres.* FROM genres
          INNER JOIN groups_genres
          ON groups_genres.genre=genres.id
          WHERE groups_genres."group"=${req.params.groupId}
      `);
      response.groupInformation['genre'] = genres;

      const { rows: groupMembers } = await pg.query(sql`
          SELECT given_name, family_name, instruments.name as instrument, role, membership
          FROM groups_musicians
          INNER JOIN musicians
            ON musicians.id = groups_musicians.musician
          INNER JOIN instruments
            ON groups_musicians.instrument = instruments.id
          WHERE groups_musicians."group"=${req.params.groupId}
        `);
      response['groupMembers'] = groupMembers;

      return res.status(200).json(response as getResponsesBody<GetGroupsById>);
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
      const { rows: admin } = await pg.query(sql`
        SELECT musician, role 
        FROM groups_musicians
        WHERE "group" = ${req.params.groupId}
      `);

      if (admin.length === 0) {
        return res.status(404).json({ msg: 'E_GROUP_DOES_NOT_EXIST' });
      }

      if (
        admin.some(
          ({ musician, role }) => role === 'admin' && musician === req.userId,
        )
      ) {
        await pg.query(sql`
          DELETE FROM groups WHERE id = ${req.params.groupId}

        `);
        return res.sendStatus(200);
      } else {
        return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
