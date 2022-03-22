import express from 'express';
import * as groupController from '../controllers/groups';

const router = express.Router();

router.get('/', groupController.getAllGroup);
router.post('/', groupController.createGroup);

router.get('/:groupId', groupController.getGroupById);
router.patch('/:groupId', groupController.modifyGroupById);
router.delete('/:groupId', groupController.deleteGroupById);

router.post('/event/join', groupController.groupJoinEvent);
router.delete('/event/delete', groupController.groupLeaveEvent);

router.post(
  '/:groupId/admins/lite_admins/:musicianId',
  groupController.addGroupLiteAdmin,
);
router.delete(
  '/:groupId/admins/lite_admins/:musicianId',
  groupController.removeGroupLiteAdmin,
);

router.post(
  '/:groupId/admins/transfer/:musicianId',
  groupController.transferGroupAdmin,
);

router.delete(
  '/:groupId/kick/:musicianId',
  groupController.kickMusicianFromGroup,
);

// router.use('/invitation', invitationRouter);

export default router;
