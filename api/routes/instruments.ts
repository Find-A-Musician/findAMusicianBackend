import express from 'express';
import { getInstruments } from '../controllers/instruments/instruments';

const router = express.Router();

router.get('/', getInstruments);

export default router;
