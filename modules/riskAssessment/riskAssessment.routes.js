import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createRiskAssessmentController,
  listRiskAssessmentsController,
  getRiskAssessmentController,
  deleteRiskAssessmentController,
} from './riskAssessment.controller.js';

const router = express.Router();

router.post('/', authenticate, createRiskAssessmentController);
router.get('/', authenticate, listRiskAssessmentsController);
router.get('/:id', authenticate, getRiskAssessmentController);
router.delete('/:id', authenticate, deleteRiskAssessmentController);

export default router; 