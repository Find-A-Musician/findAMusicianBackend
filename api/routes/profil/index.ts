import express from 'express';
import * as profilController from '../../controllers/profil';

const router = express.Router();

router.get('/', profilController.getUserProfil);
router.patch('/', profilController.modifyUserProfil);
router.delete('/', profilController.deleteUserProfil);

router.use('/groups', profilController.leaveGroupById);

export default router;
