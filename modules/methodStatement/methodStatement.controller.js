import { successResponse, errorResponse } from '../../lib/response.js';
import {
  streamMethodStatementService,
  listMethodStatementsService,
  getMethodStatementService,
  deleteMethodStatementService,
  createSafetyMeasureService,
  listSafetyMeasuresService,
} from './methodStatement.service.js';

export const createMethodStatementController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const stream = await streamMethodStatementService({ userId, ...req.body });
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create method statement', err, err?.statusCode || 500);
  }
};

export const listMethodStatementsController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listMethodStatementsService({ userId });
    return successResponse(res, 'Method statements fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch method statements', err, err?.statusCode || 500);
  }
};

export const getMethodStatementController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getMethodStatementService({ id: Number(id), userId });
    return successResponse(res, 'Method statement fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch method statement', err, err?.statusCode || 500);
  }
};

export const deleteMethodStatementController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteMethodStatementService({ id: Number(id), userId });
    return successResponse(res, 'Method statement deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete method statement', err, err?.statusCode || 500);
  }
};

export const createSafetyMeasureController = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const result = await createSafetyMeasureService({ name, imageUrl });
    return successResponse(res, 'Safety measure created', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create safety measure', err, err?.statusCode || 500);
  }
};

export const listSafetyMeasuresController = async (req, res) => {
  try {
    const result = await listSafetyMeasuresService();
    return successResponse(res, 'Safety measures fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch safety measures', err, err?.statusCode || 500);
  }
}; 