import pg from '../postgres';
import sql from 'sql-template-strings';
import express from 'express';

import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type core from 'express-serve-static-core';
import type { Request } from 'express';

type getGroups = operations['getGroups'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request<{}, getResponsesBody<getGroups>, {}, {}>,
    res: core.Response<getResponsesBody<getGroups>, {}, getHTTPCode<getGroups>>,
  ) => {
    try {
      const { rows: groups } = await pg.query(sql`
            SELECT groups.* FROM groups
        `);

      //get each genre for each group
      for (let index = 0; index < groups.length; index++) {
        const { rows: genres } = await pg.query(sql`
            SELECT genres.* FROM genres
            INNER JOIN groups_genres
            ON groups_genres.genre=genres.id
            WHERE groups_genres."group"=${groups[index].id}
        `);
        groups[index]['genres'] = genres;
      }

      //get every musicians of each group
      for (let index = 0; index < groups.length; index++) {
        const { rows: groupMembers } = await pg.query(sql`
            SELECT given_name,family_name, instruments.name as instrument, role
            FROM musicians
            INNER JOIN groups_musicians
            ON groups_musicians.musician = musicians.id
            INNER JOIN instruments
            ON groups_musicians.instrument=instruments.id
            WHERE groups_musicians."group"=${groups[index].id}
                AND groups_musicians.membership='member'
          `);
        groups[index]['groupMembers'] = groupMembers;
      }

      res.status(200).json(groups);
    } catch (err) {
      res.status(500).json({ msg: 'E_SQL_ERR', stack: err });
    }
  },
);

export default router;
