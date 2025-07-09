import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  getAuditLogsController,
  getAdminAnalyticsController,
  moderateDocumentController,
  getAllUsersController,
  getAllDocumentsController,
} from './admin.controller.js';

const router = express.Router();

router.get('/audit-logs', authenticate, getAuditLogsController);
router.get('/analytics', authenticate, getAdminAnalyticsController);
router.post('/moderate-document', authenticate, moderateDocumentController);
router.get('/users', authenticate, getAllUsersController);
router.get('/documents', authenticate, getAllDocumentsController);
router.get('/users/:id', authenticate, getUserController);
router.post('/users', authenticate, createUserController);
router.put('/users/:id', authenticate, updateUserController);
router.delete('/users/:id', authenticate, deleteUserController);
router.patch('/users/:id/role', authenticate, changeUserRoleController);

router.get('/documents/:type/:id', authenticate, getDocumentController);
router.put('/documents/:type/:id', authenticate, updateDocumentController);
router.delete('/documents/:type/:id', authenticate, deleteDocumentController);
router.post('/documents/:type/:id/moderate', authenticate, moderateDocumentController);

router.get('/audit-logs/:id', authenticate, getAuditLogController);

router.get('/roles', authenticate, listRolesController);
router.get('/role-requests', authenticate, listRoleRequestsController);
router.post('/role-requests/:id/approve', authenticate, approveRoleRequestController);
router.post('/role-requests/:id/reject', authenticate, rejectRoleRequestController);

export default router; 