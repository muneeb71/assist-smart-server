import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createLegalRegisterController,
  listLegalRegistersController,
  getLegalRegisterController,
  deleteLegalRegisterController,
} from './legalRegister.controller.js';

const router = express.Router();

router.post('/', authenticate, createLegalRegisterController);
router.get('/', authenticate, listLegalRegistersController);
router.get('/:id', authenticate, getLegalRegisterController);
router.delete('/:id', authenticate, deleteLegalRegisterController);

export default router; 