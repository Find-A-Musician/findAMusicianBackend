import type { operations } from '@schema';
import type { getHTTPCode, getResponsesBody, getRequestBody } from '@typing';
import type core from 'express-serve-static-core';
import { Event, Musician } from '../../entity';
import { getRepository } from 'typeorm';

type PostEventAdmins = operations['addEventAdmin'];

export const addAdminToEvent = async (
  req: core.Request<
    {},
    getResponsesBody<PostEventAdmins>,
    getRequestBody<PostEventAdmins>
  >,
  res: core.Response<
    getResponsesBody<PostEventAdmins>,
    {},
    getHTTPCode<PostEventAdmins>
  >,
): Promise<
  core.Response<
    getResponsesBody<PostEventAdmins>,
    {},
    getHTTPCode<PostEventAdmins>
  >
> => {
  try {
    const eventRepository = getRepository(Event);
    const musicianRepository = getRepository(Musician);

    const eventId = req.body.eventId;
    const musicianId = req.body.musicianId;

    const event = await eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ['admins', 'genres'],
    });

    if (!event) {
      return res.status(404).json({ msg: 'E_UNFOUND_EVENT' });
    }

    if (!event.admins.some(({ id }) => id === req.userId)) {
      return res.status(403).json({ msg: 'E_UNAUTHORIZED_USER' });
    }

    const musician = await musicianRepository.findOne({ id: musicianId });

    if (!musician) {
      return res.status(404).json({ msg: 'E_UNFOUND_MUSICIAN' });
    }

    // The musician is already an admin, it's not really an error, just we return 200
    if (event.admins.some(({ id }) => id === musician.id)) {
      return res.status(200).json(event);
    }
    event.admins.push(musician);

    await eventRepository.save(event);

    return res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'E_SERVER_ERROR', stack: JSON.stringify(err) });
  }
};
