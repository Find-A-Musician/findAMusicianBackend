import express, {Request, Response} from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import {operations} from '@schema';
import {HttpError} from '@typing';

type Me = operations['me'];
type MeResponse = Me['responses']['200']['content']['application/json'];

const router= express.Router();

router.get('/', async (
    req : Request,
    res : Response<MeResponse | HttpError, {}>,
)=>{
  try {
    const {rows: [musicianResponse]} = await pg.query(sql`
            SELECT *
            FROM musicians 
            WHERE musicians.id = ${req.userId}
        `);

    const {rows: [instrumentsResponse]} = await pg.query(sql`
        SELECT * FROM instruments
        INNER JOIN musicians_instruments
        ON musicians_instruments.instrument=instruments.id
        WHERE musicians_instruments.musician = ${req.userId}
    `);

    // const {rows: [genresResponse]} = await pg.query(sql`
    //     SELECT * FROM genres
    //     INNER JOIN musicians_genres
    //     ON musicians_genres.genre=genress.id
    //     WHERE musicians_genres.musician = ${req.userId}
    // `);

    const response = {
      'musician': musicianResponse,
      'instruments': instrumentsResponse,
      // 'genres': genresResponse,
    };

    res.status(200).json(response as MeResponse);
  } catch (err) {
    res.status(500).json({code: 500, msg: 'E_SQL_ERROR', stack: err});
  }
});

export default router;
