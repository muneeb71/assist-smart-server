import { successResponse, errorResponse } from '../../lib/response.js';
import {
  createToolboxTalkService,
  listToolboxTalksService,
  getToolboxTalkService,
  deleteToolboxTalkService,
} from './toolboxTalk.service.js';

export const createToolboxTalkController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await createToolboxTalkService({ userId, ...req.body });
    return successResponse(res, 'Toolbox talk created', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create toolbox talk', err, err?.statusCode || 500);
  }
};

export const listToolboxTalksController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listToolboxTalksService({ userId });
    return successResponse(res, 'Toolbox talks fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch toolbox talks', err, err?.statusCode || 500);
  }
};

export const getToolboxTalkController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getToolboxTalkService({ id: Number(id), userId });
    return successResponse(res, 'Toolbox talk fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch toolbox talk', err, err?.statusCode || 500);
  }
};

export const deleteToolboxTalkController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteToolboxTalkService({ id: Number(id), userId });
    return successResponse(res, 'Toolbox talk deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete toolbox talk', err, err?.statusCode || 500);
  }
}; 