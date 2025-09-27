import * as suggestionsService from "./suggestions.service.js";
import { successResponse, errorResponse } from "../../lib/response.js";
import { CustomError } from "../../lib/customError.js";
import { sanitizeContent } from "../../lib/utils.js";

export const generateSuggestions = async (req, res) => {
  try {
    const { content, context, documentType, section, maxSuggestions } =
      req.body;
    const { userId } = req.user;
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";

    if (!content || !context || !documentType || !section) {
      return errorResponse(
        res,
        "Missing required fields: content, context, documentType, section",
        {
          content: !content ? "Content is required" : null,
          context: !context ? "Context is required" : null,
          documentType: !documentType ? "Document type is required" : null,
          section: !section ? "Section is required" : null,
        },
        400
      );
    }

    const sanitizedContent = sanitizeContent(content);

    const result = await suggestionsService.generateSuggestions({
      content: sanitizedContent,
      context,
      documentType,
      section,
      maxSuggestions: maxSuggestions || 3,
      userId,
      ipAddress,
    });

    return successResponse(res, "Suggestions generated successfully", result);
  } catch (error) {
    console.error("Error in generateSuggestions controller:", error);

    if (error instanceof CustomError) {
      return errorResponse(res, error.message, null, error.statusCode);
    }

    return errorResponse(res, "Internal server error", error);
  }
};

export const getSuggestionStats = async (req, res) => {
  try {
    const { userId } = req.user;
    const { startDate, endDate } = req.query;

    const result = await suggestionsService.getSuggestionStats({
      userId,
      startDate,
      endDate,
    });

    return successResponse(
      res,
      "Statistics retrieved successfully",
      result.data
    );
  } catch (error) {
    console.error("Error in getSuggestionStats controller:", error);

    return errorResponse(
      res,
      "Failed to retrieve suggestion statistics",
      error
    );
  }
};

export const healthCheck = async (req, res) => {
  try {
    const hasApiKey = !!process.env.GOOGLE_GENAI_API_KEY;

    const isServiceAvailable = true;

    const health = {
      status: hasApiKey && isServiceAvailable ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        gemini: hasApiKey ? "configured" : "not_configured",
        cache: "operational",
        rateLimit: "operational",
      },
      endpoints: {
        "POST /api/suggestions": "Generate single AI suggestions",
        "POST /api/suggestions/batch": "Generate batch AI suggestions",
        "GET /api/suggestions/stats": "Get suggestion statistics",
        "GET /api/suggestions/health": "Health check endpoint",
        "GET /api/suggestions/options": "Get available options",
      },
      rateLimit: {
        single: { windowMs: 60 * 60 * 1000, max: 100 },
        batch: { windowMs: 60 * 60 * 1000, max: 50 },
      },
      limits: {
        maxBatchSize: 20,
        maxContentLength: 10000,
        requestSizeLimit: "5MB for batch requests, 1MB for single requests",
      },
      version: "1.0.0",
    };

    const statusCode = health.status === "healthy" ? 200 : 503;
    return successResponse(res, "Health check completed", health, statusCode);
  } catch (error) {
    console.error("Error in healthCheck controller:", error);

    return errorResponse(res, "Health check failed", error, 503);
  }
};

export const getOptions = async (req, res) => {
  try {
    const options = {
      contexts: [
        {
          value: "safety",
          label: "Safety",
          description: "Safety protocols and procedures",
        },
        {
          value: "compliance",
          label: "Compliance",
          description: "Regulatory compliance and legal requirements",
        },
        {
          value: "procedure",
          label: "Procedure",
          description: "Step-by-step procedures and workflows",
        },
        {
          value: "risk",
          label: "Risk",
          description: "Risk assessment and mitigation",
        },
        {
          value: "general",
          label: "General",
          description: "General content improvements",
        },
      ],
      documentTypes: [
        {
          value: "policies-procedures",
          label: "Policies & Procedures",
          description: "Company policies and procedures",
        },
        {
          value: "risk-assessment",
          label: "Risk Assessment",
          description: "Risk assessment documents",
        },
        {
          value: "incident-report",
          label: "Incident Report",
          description: "Incident reporting documents",
        },
      ],
      suggestionTypes: [
        {
          value: "grammar",
          label: "Grammar",
          description: "Grammar, punctuation, and language improvements",
        },
        {
          value: "content",
          label: "Content",
          description: "Content enhancement, structure, and clarity",
        },
        {
          value: "style",
          label: "Style",
          description: "Writing style, tone, and professionalism",
        },
        {
          value: "compliance",
          label: "Compliance",
          description: "Regulatory compliance and legal requirements",
        },
        {
          value: "safety",
          label: "Safety",
          description: "Safety protocols, procedures, and risk mitigation",
        },
      ],
      priorities: [
        {
          value: "high",
          label: "High",
          description: "Critical issues that must be addressed",
        },
        {
          value: "medium",
          label: "Medium",
          description: "Important improvements that enhance quality",
        },
        {
          value: "low",
          label: "Low",
          description: "Nice-to-have enhancements",
        },
      ],
      limits: {
        maxSuggestions: { min: 1, max: 5, default: 3 },
        maxContentLength: 10000,
        rateLimit: { requests: 100, window: "1 hour" },
      },
    };

    return successResponse(res, "Options retrieved successfully", options);
  } catch (error) {
    console.error("Error in getOptions controller:", error);

    return errorResponse(res, "Failed to retrieve options", error);
  }
};

export const generateBatchSuggestions = async (req, res) => {
  try {
    const { contents, documentType, maxSuggestions } = req.body;
    const { userId } = req.user;
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";

    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return errorResponse(
        res,
        "Contents array is required and must not be empty",
        null,
        400
      );
    }

    if (contents.length > 20) {
      return errorResponse(
        res,
        "Maximum 20 content items allowed per batch request",
        null,
        400
      );
    }

    const sanitizedContents = contents.map((content) => ({
      ...content,
      content: sanitizeContent(content.content),
    }));
    console.log("result", sanitizedContents);
    const result = await suggestionsService.generateBatchSuggestions({
      contents: sanitizedContents,
      documentType,
      maxSuggestions: maxSuggestions || 3,
      userId,
      ipAddress,
    });
    console.log("result", result);
    return successResponse(
      res,
      "Batch suggestions generated successfully",
      result
    );
  } catch (error) {
    console.error("Error in generateBatchSuggestions controller:", error);

    if (error instanceof CustomError) {
      return errorResponse(res, error.message, null, error.statusCode);
    }

    return errorResponse(res, "Internal server error", error);
  }
};

