import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createIncidentInvestigationController,
  listIncidentInvestigationsController,
  getIncidentInvestigationController,
  deleteIncidentInvestigationController,
} from './incidentInvestigation.controller.js';

const router = express.Router();

router.post('/', authenticate, createIncidentInvestigationController);
router.get('/', authenticate, listIncidentInvestigationsController);
router.get('/:id', authenticate, getIncidentInvestigationController);
router.delete('/:id', authenticate, deleteIncidentInvestigationController);

export default router; 