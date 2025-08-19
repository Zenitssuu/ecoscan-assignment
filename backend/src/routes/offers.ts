import express from 'express';
import { offersController } from '../controllers/offersController';

const router = express.Router();

router.get('/', offersController);

export default router;
