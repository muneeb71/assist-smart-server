import { successResponse, errorResponse } from '../../lib/response.js';
import {
  createIncidentInvestigationService,
  listIncidentInvestigationsService,
  getIncidentInvestigationService,
  deleteIncidentInvestigationService,
  streamIncidentInvestigationService,
  updateIncidentInvestigationService,
} from './incidentInvestigation.service.js';

export const createIncidentInvestigationController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const stream = await streamIncidentInvestigationService({ userId, ...req.body });
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create incident investigation', err, err?.statusCode || 500);
  }
};

export const listIncidentInvestigationsController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listIncidentInvestigationsService({ userId });
    return successResponse(res, 'Incident investigations fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch incident investigations', err, err?.statusCode || 500);
  }
};

export const getIncidentInvestigationController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getIncidentInvestigationService({ id: Number(id), userId });
    return successResponse(res, 'Incident investigation fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch incident investigation', err, err?.statusCode || 500);
  }
};

export const deleteIncidentInvestigationController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteIncidentInvestigationService({ id: Number(id), userId });
    return successResponse(res, 'Incident investigation deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete incident investigation', err, err?.statusCode || 500);
  }
};

export const updateIncidentInvestigationController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const updateData = req.body;
    const result = await updateIncidentInvestigationService({ id: Number(id), userId, updateData });
    return successResponse(res, 'Incident investigation updated', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to update incident investigation', err, err?.statusCode || 500);
  }
}; 