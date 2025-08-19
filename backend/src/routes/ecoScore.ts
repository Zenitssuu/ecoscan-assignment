import express from 'express';
import { ecoScoreController } from '../controllers/ecoScoreController';

const router = express.Router();

router.post('/', ecoScoreController);

export default router;
