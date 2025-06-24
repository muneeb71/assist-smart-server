import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createIncidentReportController,
  listIncidentReportsController,
  getIncidentReportController,
  deleteIncidentReportController,
} from './incidentReport.controller.js';

const router = express.Router();

router.post('/', authenticate, createIncidentReportController);
router.get('/', authenticate, listIncidentReportsController);
router.get('/:id', authenticate, getIncidentReportController);
router.delete('/:id', authenticate, deleteIncidentReportController);

export default router; 