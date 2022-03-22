import express from 'express';
import * as musicianController from '../controllers/musicians';

const router = express.Router();

router.get('/', musicianController.getAllMusicians);

router.get('/:musicianId', musicianController.getMusicianById);

router.get(
  '/:musicianId/groups/:groupId/membership',
  musicianController.getMusicianGroupMembership,
);

export default router;
