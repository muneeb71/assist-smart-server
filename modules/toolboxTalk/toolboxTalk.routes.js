import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createToolboxTalkController,
  listToolboxTalksController,
  getToolboxTalkController,
  deleteToolboxTalkController,
} from './toolboxTalk.controller.js';

const router = express.Router();

router.post('/', authenticate, createToolboxTalkController);
router.get('/', authenticate, listToolboxTalksController);
router.get('/:id', authenticate, getToolboxTalkController);
router.delete('/:id', authenticate, deleteToolboxTalkController);

export default router; 