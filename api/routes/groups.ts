import express from 'express';
import * as groupController from '../controllers/groups';

const router = express.Router();

router.get('/', groupController.getAllGroup);
router.post('/', groupController.createGroup);

router.get('/:groupId', groupController.getGroupById);
router.patch('/:groupId', groupController.modifyGroupById);
router.delete('/:groupId', groupController.deleteGroupById);

router.post('/event/join', groupController.groupJoinEvent);

// router.use('/invitation', invitationRouter);

export default router;
