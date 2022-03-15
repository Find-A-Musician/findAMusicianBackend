import express from 'express';
import { refreshToken } from '../../controllers/auth';

const router = express.Router();

router.post('/', refreshToken);

export default router;
