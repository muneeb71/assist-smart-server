import { successResponse, errorResponse } from '../../lib/response.js';
import {
  streamIncidentReportService,
  listIncidentReportsService,
  getIncidentReportService,
  deleteIncidentReportService,
} from './incidentReport.service.js';

export const createIncidentReportController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const stream = await streamIncidentReportService({ userId, ...req.body });
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to create incident report', err, err?.statusCode || 500);
  }
};

export const listIncidentReportsController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listIncidentReportsService({ userId });
    return successResponse(res, 'Incident reports fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch incident reports', err, err?.statusCode || 500);
  }
};

export const getIncidentReportController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getIncidentReportService({ id: Number(id), userId });
    return successResponse(res, 'Incident report fetched', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to fetch incident report', err, err?.statusCode || 500);
  }
};

export const deleteIncidentReportController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteIncidentReportService({ id: Number(id), userId });
    return successResponse(res, 'Incident report deleted', result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 'Failed to delete incident report', err, err?.statusCode || 500);
  }
}; 