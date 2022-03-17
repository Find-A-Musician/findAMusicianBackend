import type { operations } from '@schema';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getResponsesBody } from '@typing';
import type { Request } from 'express';
import { getRepository } from 'typeorm';
import { Instrument } from '../../entity';

type GetInstruments = operations['getInstruments'];

export const getInstruments = async (
  req: Request,
  res: core.Response<
    getResponsesBody<GetInstruments>,
    {},
    getHTTPCode<GetInstruments>
  >,
): Promise<
  core.Response<
    getResponsesBody<GetInstruments>,
    {},
    getHTTPCode<GetInstruments>
  >
> => {
  try {
    const instruments = await getRepository(Instrument).find();

    return res.status(200).json(instruments);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};
