import { successResponse, errorResponse } from "../../lib/response.js";
import {
  streamRiskAssessmentService,
  listRiskAssessmentsService,
  getRiskAssessmentService,
  deleteRiskAssessmentService,
  updateRiskAssessmentService,
} from "./riskAssessment.service.js";

export const createRiskAssessmentController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const stream = await streamRiskAssessmentService({ userId, ...req.body });
    res.setHeader("Content-Type", "text/plain");
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to create risk assessment",
      err,
      err?.statusCode || 500
    );
  }
};

export const listRiskAssessmentsController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const result = await listRiskAssessmentsService({ userId });
    return successResponse(res, "Risk assessments fetched", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to fetch risk assessments",
      err,
      err?.statusCode || 500
    );
  }
};

export const getRiskAssessmentController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await getRiskAssessmentService({ id: Number(id), userId });
    return successResponse(res, "Risk assessment fetched", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to fetch risk assessment",
      err,
      err?.statusCode || 500
    );
  }
};

export const deleteRiskAssessmentController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const result = await deleteRiskAssessmentService({
      id: Number(id),
      userId,
    });
    return successResponse(res, "Risk assessment deleted", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to delete risk assessment",
      err,
      err?.statusCode || 500
    );
  }
};

export const updateRiskAssessmentController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const updateData = req.body;
    const result = await updateRiskAssessmentService({
      id: Number(id),
      userId,
      updateData,
    });
    return successResponse(res, "Risk assessment updated", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to update risk assessment",
      err,
      err?.statusCode || 500
    );
  }
};
