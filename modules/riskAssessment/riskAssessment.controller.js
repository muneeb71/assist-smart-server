import { successResponse, errorResponse } from "../../lib/response.js";
import {
  streamRiskAssessmentService,
  listRiskAssessmentsService,
  getRiskAssessmentService,
  deleteRiskAssessmentService,
  generateRiskAssessmentStructureService,
  generateRiskAssessmentChapterTableService,
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

export const generateRiskAssessmentStructure = async (req, res) => {
  try {
    const {
      industry,
      activityType,
      location,
      existingControlMeasures,
      responsibleDepartments,
    } = req.body;
    if (!industry || !activityType || !location) {
      return errorResponse(
        res,
        "Missing required fields",
        err,
        err?.statusCode || 500
      );
    }
    const structure = await generateRiskAssessmentStructureService({
      industry,
      activityType,
      location,
      existingControlMeasures,
      responsibleDepartments,
    });
    return successResponse(
      res,
      "Risk assessments structure created",
      structure
    );
  } catch (err) {
    return errorResponse(
      res,
      "Failed to delete risk assessment",
      err,
      err?.statusCode || 500
    );
  }
};

export const generateRiskAssessmentChapterTable = async (req, res) => {
  try {
    const { chapterDetails } = req.body;
    if (!chapterDetails) {
      return errorResponse(
        res,
        "Missing required fields",
        err,
        err?.statusCode || 500
      );
    }
    const content = await generateRiskAssessmentChapterTableService({
      chapterDetails,
    });
    return successResponse(res, "Risk assessment content created", content);
  } catch (err) {
    return errorResponse(
      res,
      "Failed to delete risk assessment",
      err,
      err?.statusCode || 500
    );
  }
};
