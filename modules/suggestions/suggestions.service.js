import { gemini } from "../../config/aiClients.js";
import { CustomError } from "../../lib/customError.js";

const suggestionCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const generateSuggestions = async ({
  content,
  context,
  documentType,
  section,
  maxSuggestions = 3,
  userId,
  ipAddress,
}) => {
  const startTime = Date.now();

  try {
    validateInput({ content, context, documentType, section, maxSuggestions });

    const cacheKey = generateCacheKey({
      content,
      context,
      documentType,
      section,
    });
    const cachedResult = getCachedSuggestion(cacheKey);
    if (cachedResult) {
      return {
        ...cachedResult,
        metadata: {
          ...cachedResult.metadata,
          cached: true,
          processingTime: Date.now() - startTime,
        },
      };
    }

    const suggestions = await generateAISuggestions({
      content,
      context,
      documentType,
      section,
      maxSuggestions,
    });

    const processingTime = Date.now() - startTime;

    const response = {
      suggestions,
      metadata: {
        timestamp: new Date().toISOString(),
        contentLength: content.length,
        context,
        documentType,
        section,
        processingTime,
        cached: false,
      },
    };

    cacheSuggestion(cacheKey, response);

    await logSuggestionRequest({
      userId,
      ipAddress,
      context,
      documentType,
      section,
      contentLength: content.length,
      suggestionsCount: suggestions.length,
      processingTime,
    });

    return response;
  } catch (error) {
    console.error("Error generating suggestions:", error);

    await logSuggestionError({
      userId,
      ipAddress,
      error: error.message,
      context,
      documentType,
    });

    throw new CustomError("Internal server error", 500);
  }
};

const generateAISuggestions = async ({
  content,
  context,
  documentType,
  section,
  maxSuggestions,
}) => {
  const systemPrompt = buildSystemPrompt(context, documentType, section);
  const userPrompt = buildUserPrompt(content, maxSuggestions);
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const responseText = response.text;
    if (!responseText) {
      throw new CustomError("AI service returned empty response", 500);
    }

    return parseAIResponse(responseText, maxSuggestions);
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error.message?.includes("quota")) {
      throw new CustomError("AI service quota exceeded", 503);
    }
    if (error.message?.includes("rate")) {
      throw new CustomError("AI service rate limit exceeded", 429);
    }
    throw new CustomError("AI service temporarily unavailable", 503);
  }
};

const buildSystemPrompt = (context, documentType, section) => {
  const basePrompt = `You are an expert document editor specializing in professional workplace documentation. 
Analyze the provided content and generate specific, actionable suggestions for improvement.

Context Guidelines:
- Focus on the specified context: ${context}
- Consider the document type: ${documentType}
- Pay attention to the section: ${section}

Suggestion Types:
- grammar: Grammar, punctuation, and language improvements
- content: Content enhancement, structure, and clarity
- style: Writing style, tone, and professionalism
- compliance: Regulatory compliance and legal requirements
- safety: Safety protocols, procedures, and risk mitigation

Priority Levels:
- high: Critical issues that must be addressed
- medium: Important improvements that enhance quality
- low: Nice-to-have enhancements

Response Format:
Return a JSON array of suggestions with this exact structure:
[
  {
    "id": "unique-id",
    "type": "safety|grammar|content|style|compliance",
    "category": "Human-readable category",
    "priority": "high|medium|low",
    "suggestion": "Specific recommendation",
    "improvedText": "Enhanced version (optional)",
    "reasoning": "Why this suggestion is valuable"
  }
]`;

  // Add context-specific guidance
  const contextGuidance = getContextGuidance(context);
  return basePrompt + "\n\n" + contextGuidance;
};

const getContextGuidance = (context) => {
  const guidanceMap = {
    safety: `
Safety Context Guidelines:
- Emphasize safety protocols, emergency procedures, and risk mitigation
- Focus on clear, actionable safety instructions
- Highlight potential hazards and protective measures
- Ensure compliance with safety regulations and standards
- Prioritize worker protection and accident prevention`,

    compliance: `
Compliance Context Guidelines:
- Emphasize regulatory references and legal requirements
- Focus on audit trails and documentation standards
- Highlight compliance gaps and regulatory risks
- Ensure proper legal language and terminology
- Prioritize regulatory adherence and legal protection`,

    procedure: `
Procedure Context Guidelines:
- Improve step-by-step instructions and clarity
- Focus on responsibilities and accountability
- Enhance workflow and process efficiency
- Ensure logical sequence and completeness
- Prioritize operational effectiveness and clarity`,

    risk: `
Risk Context Guidelines:
- Enhance risk assessment and control measures
- Focus on monitoring procedures and mitigation strategies
- Highlight potential risks and their impacts
- Ensure comprehensive risk coverage
- Prioritize risk reduction and management effectiveness`,

    general: `
General Context Guidelines:
- Focus on grammar, style, and general content improvements
- Enhance readability and professional tone
- Improve structure and organization
- Ensure clarity and conciseness
- Prioritize overall document quality and professionalism`,
  };

  return guidanceMap[context] || guidanceMap.general;
};

const buildUserPrompt = (content, maxSuggestions) => {
  return `Analyze the following content and provide up to ${maxSuggestions} specific, actionable suggestions for improvement:

Content:
"${content}"

Requirements:
- Generate exactly ${maxSuggestions} suggestions
- Each suggestion must be specific and actionable
- Include improved text where applicable
- Provide clear reasoning for each suggestion
- Ensure suggestions are relevant to the content
- Return only valid JSON array format`;
};

const parseAIResponse = (response, maxSuggestions) => {
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const suggestions = JSON.parse(jsonMatch[0]);

    return suggestions.slice(0, maxSuggestions).map((suggestion, index) => ({
      id: suggestion.id || `suggestion-${Date.now()}-${index}`,
      type: suggestion.type || "content",
      category: suggestion.category || "General Improvement",
      priority: suggestion.priority || "medium",
      suggestion: suggestion.suggestion || "",
      improvedText: suggestion.improvedText || null,
      reasoning: suggestion.reasoning || "",
    }));
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return generateFallbackSuggestions(maxSuggestions);
  }
};

const generateFallbackSuggestions = (maxSuggestions) => {
  const fallbackSuggestions = [
    {
      id: `fallback-${Date.now()}-1`,
      type: "content",
      category: "Content Enhancement",
      priority: "medium",
      suggestion:
        "Consider adding more specific details and examples to improve clarity.",
      reasoning: "Specific details help readers better understand the content.",
    },
    {
      id: `fallback-${Date.now()}-2`,
      type: "style",
      category: "Style Improvement",
      priority: "low",
      suggestion:
        "Review the tone and ensure it matches the document's purpose.",
      reasoning: "Consistent tone improves document professionalism.",
    },
  ];

  return fallbackSuggestions.slice(0, maxSuggestions);
};

const validateInput = ({
  content,
  context,
  documentType,
  section,
  maxSuggestions,
}) => {
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new CustomError(
      "Content is required and must be a non-empty string",
      400
    );
  }

  if (content.length > 10000) {
    throw new CustomError(
      "Content exceeds maximum length of 10,000 characters",
      400
    );
  }

  const validContexts = [
    "safety",
    "compliance",
    "procedure",
    "risk",
    "general",
  ];
  if (!validContexts.includes(context)) {
    throw new CustomError(
      `Invalid context. Must be one of: ${validContexts.join(", ")}`,
      400
    );
  }

  const validDocumentTypes = [
    "policies-procedures",
    "risk-assessment",
    "incident-report",
  ];
  if (!validDocumentTypes.includes(documentType)) {
    throw new CustomError(
      `Invalid document type. Must be one of: ${validDocumentTypes.join(", ")}`,
      400
    );
  }

  if (!section || typeof section !== "string" || section.trim().length === 0) {
    throw new CustomError(
      "Section is required and must be a non-empty string",
      400
    );
  }

  if (maxSuggestions < 1 || maxSuggestions > 5) {
    throw new CustomError("Max suggestions must be between 1 and 5", 400);
  }
};

const generateCacheKey = ({ content, context, documentType, section }) => {
  const contentHash = require("crypto")
    .createHash("md5")
    .update(content.toLowerCase().trim())
    .digest("hex");
  return `${context}:${documentType}:${section}:${contentHash}`;
};

const getCachedSuggestion = (cacheKey) => {
  const cached = suggestionCache.get(cacheKey);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    suggestionCache.delete(cacheKey);
    return null;
  }

  return cached.data;
};

const cacheSuggestion = (cacheKey, data) => {
  suggestionCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });

  if (suggestionCache.size > 1000) {
    const now = Date.now();
    for (const [key, value] of suggestionCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        suggestionCache.delete(key);
      }
    }
  }
};

const logSuggestionRequest = async ({
  userId,
  ipAddress,
  context,
  documentType,
  section,
  contentLength,
  suggestionsCount,
  processingTime,
}) => {
  try {
    console.log(
      `AI Suggestion Request: User ${userId}, IP ${ipAddress}, Context ${context}, Type ${documentType}, Section ${section}, Length ${contentLength}, Suggestions ${suggestionsCount}, Time ${processingTime}ms`
    );
  } catch (error) {
    console.error("Error logging suggestion request:", error);
  }
};

const logSuggestionError = async ({
  userId,
  ipAddress,
  error,
  context,
  documentType,
}) => {
  try {
    console.error(
      `AI Suggestion Error: User ${userId}, IP ${ipAddress}, Error ${error}, Context ${context}, Type ${documentType}`
    );
  } catch (logError) {
    console.error("Error logging suggestion error:", logError);
  }
};

export const getSuggestionStats = async ({ userId, startDate, endDate }) => {
  try {
    // TODO: Implement actual statistics retrieval from database
    // For now, return mock data
    return {
      success: true,
      data: {
        totalRequests: 0,
        averageProcessingTime: 0,
        suggestionsByType: {},
        contextDistribution: {},
        errorRate: 0,
      },
    };
  } catch (error) {
    console.error("Error retrieving suggestion statistics:", error);
    throw new CustomError("Failed to retrieve suggestion statistics", 500);
  }
};
