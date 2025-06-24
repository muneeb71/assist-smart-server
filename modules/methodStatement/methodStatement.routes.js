import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createMethodStatementController,
  listMethodStatementsController,
  getMethodStatementController,
  deleteMethodStatementController,
  createSafetyMeasureController,
  listSafetyMeasuresController,
} from './methodStatement.controller.js';

const router = express.Router();

router.post('/', authenticate, createMethodStatementController);
router.get('/', authenticate, listMethodStatementsController);
router.get('/:id', authenticate, getMethodStatementController);
router.delete('/:id', authenticate, deleteMethodStatementController);
router.post('/safety-measures', authenticate, createSafetyMeasureController);

export default router; 