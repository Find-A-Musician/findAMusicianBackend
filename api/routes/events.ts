import express from 'express';
import * as eventController from '../controllers/events';

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);

router.get('/:eventId', eventController.getEventById);
router.patch('/:eventId', eventController.modifyEventById);
router.delete('/:eventId', eventController.deleteEventById);

router.post('/admins', eventController.addAdminToEvent);

router.delete('/:eventId/kick/:groupId', eventController.kickGroupFromEvent);

export default router;
