import { successResponse, errorResponse } from '../../lib/response.js';
import {
  listLegalRegistersService,
  getLegalRegisterService,
  deleteLegalRegisterService,
  getLegalRegisterTableData,
} from './legalRegister.service.js';

export const createLegalRegisterController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await getLegalRegisterTableData({ userId, ...req.body });

    return successResponse(res, 'Legal Register created', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create Legal Register', err, err?.statusCode || 500);
  }
};  

export const listLegalRegistersController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listLegalRegistersService({ userId });
    return successResponse(res, 'Legal Registers fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch Legal Registers', err, err?.statusCode || 500);
  }
};

export const getLegalRegisterController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getLegalRegisterService({ id: Number(id), userId });
    return successResponse(res, 'Legal Register fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch Legal Register', err, err?.statusCode || 500);
  }
};

export const deleteLegalRegisterController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteLegalRegisterService({ id: Number(id), userId });
    return successResponse(res, 'Legal Register deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete Legal Register', err, err?.statusCode || 500);
  }
}; 