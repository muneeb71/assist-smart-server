import { successResponse, errorResponse } from '../../lib/response.js';
import {
  streamJobSafetyAnalysisService,
  listJobSafetyAnalysesService,
  getJobSafetyAnalysisService,
  deleteJobSafetyAnalysisService,
} from './jobSafetyAnalysis.service.js';

export const createJobSafetyAnalysisController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const stream = await streamJobSafetyAnalysisService({ userId, ...req.body });
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create job safety analysis', err, err?.statusCode || 500);
  }
};

export const listJobSafetyAnalysesController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listJobSafetyAnalysesService({ userId });
    return successResponse(res, 'Job safety analyses fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch job safety analyses', err, err?.statusCode || 500);
  }
};

export const getJobSafetyAnalysisController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getJobSafetyAnalysisService({ id: Number(id), userId });
    return successResponse(res, 'Job safety analysis fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch job safety analysis', err, err?.statusCode || 500);
  }
};

export const deleteJobSafetyAnalysisController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteJobSafetyAnalysisService({ id: Number(id), userId });
    return successResponse(res, 'Job safety analysis deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete job safety analysis', err, err?.statusCode || 500);
  }
}; 