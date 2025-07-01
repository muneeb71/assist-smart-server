import { successResponse, errorResponse } from '../../lib/response.js';
import {
  streamResponsePlanService,
  listResponsePlansService,
  getResponsePlanService,
  deleteResponsePlanService,
} from './responsePlan.service.js';

export const createResponsePlanController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const stream = await streamResponsePlanService({ userId, ...req.body });
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create response plan', err, err?.statusCode || 500);
  }
};

export const listResponsePlansController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listResponsePlansService({ userId });
    return successResponse(res, 'Response plans fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch response plans', err, err?.statusCode || 500);
  }
};

export const getResponsePlanController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getResponsePlanService({ id: Number(id), userId });
    return successResponse(res, 'Response plan fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch response plan', err, err?.statusCode || 500);
  }
};

export const deleteResponsePlanController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteResponsePlanService({ id: Number(id), userId });
    return successResponse(res, 'Response plan deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete response plan', err, err?.statusCode || 500);
  }
}; 