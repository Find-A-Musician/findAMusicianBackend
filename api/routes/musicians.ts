import express, {Request, Response} from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type {operations} from '@schema';
import {HttpError} from '@typing';

type GetMusician = operations['getMusicians'];
type GetMusicianResponse =
GetMusician['responses']['200']['content']['application/json'];

const router=express.Router();

router.get('/', async (
    req: Request,
    res: Response<GetMusicianResponse | HttpError, {}>,
) => {
  const {rows} = await pg.query(
      sql `SELECT * FROM musicians`,
  );

  for (let i=0; i<rows.length; i++) {
    const {rows: genreRows} = await pg.query(sql`
      SELECT instruments.* 
      FROM instruments
      INNER JOIN musicians_instruments
      ON instruments.id = musicians_instruments.instrument
      WHERE musicians_instruments.musician= ${rows[i].id}
    `);
    console.log(rows[i].id);
    console.log(genreRows);
    rows[i]['instruments']=genreRows;
  }

  res.status(200).json((rows as GetMusicianResponse));
});

export default router;
