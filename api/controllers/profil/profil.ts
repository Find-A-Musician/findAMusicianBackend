import { DeepPartial, getRepository } from 'typeorm';
import { Musician, Instrument, Genre, MusicianGroup } from '../../entity';
import type { operations } from '@schema';
import type { Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody, getRequestBody } from '@typing';
import type { NextFunction } from 'express';

type getProfil = operations['getProfil'];
type patchProfil = operations['patchProfil'];
type deleteProfil = operations['deleteProfil'];

export const getUserProfil = async (
  req: Request,
  res: core.Response<getResponsesBody<getProfil>, {}, getHTTPCode<getProfil>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<getProfil>, {}, getHTTPCode<getProfil>>
> => {
  try {
    const profil = await getRepository(Musician).findOne({
      where: { id: req.userId },
      relations: ['instruments', 'genres'],
    });

    const musicianGroups = await getRepository(MusicianGroup).find({
      where: [
        {
          musician: profil,
          membership: 'admin',
        },
        {
          musician: profil,
          membership: 'member',
        },
        {
          musician: profil,
          membership: 'lite_admin',
        },
      ],
      relations: ['group', 'group.genres'],
    });

    return res.status(200).json({ ...profil, groups: musicianGroups });
  } catch (err) {
    next(err);
  }
};

export const modifyUserProfil = async (
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
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<patchProfil>, {}, getHTTPCode<patchProfil>>
> => {
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
    next(err);
  }
};

export const deleteUserProfil = async (
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
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<deleteProfil>, {}, getHTTPCode<deleteProfil>>
> => {
  try {
    await getRepository(Musician).delete({ id: req.userId });

    return res.status(200).json('The user has been deleted');
  } catch (err) {
    next(err);
  }
};
