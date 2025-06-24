import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createJobSafetyAnalysisController,
  listJobSafetyAnalysesController,
  getJobSafetyAnalysisController,
  deleteJobSafetyAnalysisController,
} from './jobSafetyAnalysis.controller.js';

const router = express.Router();

router.post('/', authenticate, createJobSafetyAnalysisController);
router.get('/', authenticate, listJobSafetyAnalysesController);
router.get('/:id', authenticate, getJobSafetyAnalysisController);
router.delete('/:id', authenticate, deleteJobSafetyAnalysisController);

export default router; 