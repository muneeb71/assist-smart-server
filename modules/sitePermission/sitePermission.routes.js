import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  createSitePermissionController,
  listSitePermissionsController,
  getSitePermissionController,
  deleteSitePermissionController,
} from './sitePermission.controller.js';

const router = express.Router();

router.post('/', authenticate, createSitePermissionController);
router.get('/', authenticate, listSitePermissionsController);
router.get('/:id', authenticate, getSitePermissionController);
router.delete('/:id', authenticate, deleteSitePermissionController);

export default router; 