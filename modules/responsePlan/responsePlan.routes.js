import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createResponsePlanController,
  listResponsePlansController,
  getResponsePlanController,
  deleteResponsePlanController,
} from './responsePlan.controller.js';

const router = express.Router();

router.post('/', authenticate, createResponsePlanController);
router.get('/', authenticate, listResponsePlansController);
router.get('/:id', authenticate, getResponsePlanController);
router.delete('/:id', authenticate, deleteResponsePlanController);

export default router; 