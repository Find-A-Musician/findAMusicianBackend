import express from 'express';
import { logout } from '../controllers/auth';

const router = express.Router();

router.delete('/', logout);

export default router;
