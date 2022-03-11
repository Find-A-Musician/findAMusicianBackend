import express from 'express';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody, getRequestBody } from '@typing';
import { DeepPartial, getRepository } from 'typeorm';
import { Musician, Instrument, Genre } from '../../entity';

type getProfil = operations['getProfil'];
type patchProfil = operations['patchProfil'];
type deleteProfil = operations['deleteProfil'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<getResponsesBody<getProfil>, {}, getHTTPCode<getProfil>>,
  ) => {
    try {
      const profil = await getRepository(Musician).findOne({
        where: { id: req.userId },
        relations: ['instruments', 'genres'],
      });

      return res.status(200).json(profil);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

router.patch(
  '/',
  async (
    req: Request<
      {},
      getResponsesBody<patchProfil>,
      getRequestBody<patchProfil>,
      {}
    >,
    res: core.Response<
      getResponsesBody<patchProfil>,
      {},
      getHTTPCode<patchProfil>
    >,
  ) => {
    try {
      const { instruments, genres, ...basicInfo } = req.body;

      const update: DeepPartial<Musician> = { ...basicInfo };

      if (instruments) {
        const newInstruments: Instrument[] = [];
        for (let i = 0; i < instruments.length; i++) {
          newInstruments.push(
            await getRepository(Instrument).findOne({
              name: instruments[i].name,
            }),
          );
        }

        update['instruments'] = newInstruments;
      }

      if (genres) {
        const newGenres: Genre[] = [];
        for (let i = 0; i < genres.length; i++) {
          newGenres.push(
            await getRepository(Genre).findOne({
              name: genres[i].name,
            }),
          );
        }

        update['genres'] = newGenres;
      }

      await getRepository(Musician).save({ id: req.userId, ...update });

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
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<deleteProfil>,
      getRequestBody<deleteProfil>
    >,
    res: core.Response<
      getResponsesBody<deleteProfil>,
      {},
      getHTTPCode<deleteProfil>
    >,
  ) => {
    try {
      await getRepository(Musician).delete({ id: req.userId });

      return res.status(200).json('The user has been deleted');
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'E_SQL_ERROR', stack: JSON.stringify(err) });
    }
  },
);

export default router;
