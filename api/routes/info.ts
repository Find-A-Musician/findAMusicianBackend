import express from 'express';
import * as infoController from '../controllers/info';

const router = express.Router();

router.get('/', infoController.getInfo);

export default router;
