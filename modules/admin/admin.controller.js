import { successResponse, errorResponse } from '../../lib/response.js';
import {
  getAuditLogsService,
  getAdminAnalyticsService,
  moderateDocumentService,
  getAllUsersService,
  getAllDocumentsService,
  getUserService,
  createUserService,
  updateUserService,
  deleteUserService,
  changeUserRoleService,
  getDocumentService,
  updateDocumentService,
  deleteDocumentService,
  getAuditLogService,
  listRolesService,
  listRoleRequestsService,
  approveRoleRequestService,
  rejectRoleRequestService,
} from './admin.service.js';

export const getAuditLogsController = async (req, res) => {
  try {
    const result = await getAuditLogsService(req.query);
    return successResponse(res, 'Audit logs fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch audit logs', err, err?.statusCode || 500);
  }
};

export const getAdminAnalyticsController = async (req, res) => {
  try {
    const result = await getAdminAnalyticsService();
    return successResponse(res, 'Analytics fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch analytics', err, err?.statusCode || 500);
  }
};

export const moderateDocumentController = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { documentType, documentId, action } = req.body;
    const result = await moderateDocumentService({ documentType, documentId, action, adminId });
    return successResponse(res, 'Moderation action logged', result);
  } catch (err) {
    return errorResponse(res, 'Failed to moderate document', err, err?.statusCode || 500);
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const result = await getAllUsersService(req.query);
    return successResponse(res, 'Users fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch users', err, err?.statusCode || 500);
  }
};

export const getAllDocumentsController = async (req, res) => {
  try {
    const result = await getAllDocumentsService(req.query);
    return successResponse(res, 'Documents fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch documents', err, err?.statusCode || 500);
  }
};

export const getUserController = async (req, res) => {
  try {
    const result = await getUserService(req.params.id);
    return successResponse(res, 'User fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch user', err, err?.statusCode || 500);
  }
};

export const createUserController = async (req, res) => {
  try {
    const result = await createUserService(req.body);
    return successResponse(res, 'User created', result);
  } catch (err) {
    return errorResponse(res, 'Failed to create user', err, err?.statusCode || 500);
  }
};

export const updateUserController = async (req, res) => {
  try {
    const result = await updateUserService(req.params.id, req.body);
    return successResponse(res, 'User updated', result);
  } catch (err) {
    return errorResponse(res, 'Failed to update user', err, err?.statusCode || 500);
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const result = await deleteUserService(req.params.id);
    return successResponse(res, 'User deleted', result);
  } catch (err) {
    return errorResponse(res, 'Failed to delete user', err, err?.statusCode || 500);
  }
};

export const changeUserRoleController = async (req, res) => {
  try {
    const result = await changeUserRoleService(req.params.id, req.body.roleId);
    return successResponse(res, 'User role updated', result);
  } catch (err) {
    return errorResponse(res, 'Failed to update user role', err, err?.statusCode || 500);
  }
};

export const getDocumentController = async (req, res) => {
  try {
    const result = await getDocumentService(req.params.type, req.params.id);
    return successResponse(res, 'Document fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch document', err, err?.statusCode || 500);
  }
};

export const updateDocumentController = async (req, res) => {
  try {
    const result = await updateDocumentService(req.params.type, req.params.id, req.body);
    return successResponse(res, 'Document updated', result);
  } catch (err) {
    return errorResponse(res, 'Failed to update document', err, err?.statusCode || 500);
  }
};

export const deleteDocumentController = async (req, res) => {
  try {
    const result = await deleteDocumentService(req.params.type, req.params.id);
    return successResponse(res, 'Document deleted', result);
  } catch (err) {
    return errorResponse(res, 'Failed to delete document', err, err?.statusCode || 500);
  }
};

export const getAuditLogController = async (req, res) => {
  try {
    const result = await getAuditLogService(req.params.id);
    return successResponse(res, 'Audit log fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch audit log', err, err?.statusCode || 500);
  }
};

export const listRolesController = async (req, res) => {
  try {
    const result = await listRolesService();
    return successResponse(res, 'Roles fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch roles', err, err?.statusCode || 500);
  }
};

export const listRoleRequestsController = async (req, res) => {
  try {
    const result = await listRoleRequestsService();
    return successResponse(res, 'Role requests fetched', result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch role requests', err, err?.statusCode || 500);
  }
};

export const approveRoleRequestController = async (req, res) => {
  try {
    const result = await approveRoleRequestService(req.params.id);
    return successResponse(res, 'Role request approved', result);
  } catch (err) {
    return errorResponse(res, 'Failed to approve role request', err, err?.statusCode || 500);
  }
};

export const rejectRoleRequestController = async (req, res) => {
  try {
    const result = await rejectRoleRequestService(req.params.id);
    return successResponse(res, 'Role request rejected', result);
  } catch (err) {
    return errorResponse(res, 'Failed to reject role request', err, err?.statusCode || 500);
  }
}; 