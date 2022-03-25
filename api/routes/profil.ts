import express from 'express';
import * as profilController from '../controllers/profil';

const router = express.Router();

router.get('/', profilController.getUserProfil);
router.patch('/', profilController.modifyUserProfil);
router.delete('/', profilController.deleteUserProfil);

router.use('/groups/:groupId/leave', profilController.leaveGroupById);

router.get('/notifications', profilController.getNotifications);
router.delete('/notifications', profilController.deleteAllNotifications);
router.delete(
  '/notifications/:notificationId',
  profilController.deleteNotificationById,
);

router.get('/invitations/sent', profilController.getUserInvitationsSent);
router.get(
  '/invitations/received',
  profilController.getUserInvitationsReceived,
);
router.post('/invitations', profilController.postUserToGroupInvitation);

export default router;
