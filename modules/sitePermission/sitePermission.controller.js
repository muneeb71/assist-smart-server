import { successResponse, errorResponse } from '../../lib/response.js';
import {
  createSitePermissionService,
  listSitePermissionsService,
  getSitePermissionService,
  deleteSitePermissionService,
} from './sitePermission.service.js';

export const createSitePermissionController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await createSitePermissionService({ userId, ...req.body });
    return successResponse(res, 'Site permission created', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create site permission', err, err?.statusCode || 500);
  }
};

export const listSitePermissionsController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listSitePermissionsService({ userId });
    return successResponse(res, 'Site permissions fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch site permissions', err, err?.statusCode || 500);
  }
};

export const getSitePermissionController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getSitePermissionService({ id: Number(id), userId });
    return successResponse(res, 'Site permission fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch site permission', err, err?.statusCode || 500);
  }
};

export const deleteSitePermissionController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteSitePermissionService({ id: Number(id), userId });
    return successResponse(res, 'Site permission deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete site permission', err, err?.statusCode || 500);
  }
}; 