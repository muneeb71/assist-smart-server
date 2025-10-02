import { gemini } from "../../config/aiClients.js";
import { CustomError } from "../../lib/customError.js";
import crypto from "crypto";

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
  console.log("fullPrompt", fullPrompt);
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const responseText = response.text;
    if (!responseText) {
      throw new CustomError("AI service returned empty response", 500);
    }

    // Limit response length to prevent parsing issues
    const maxResponseLength = 50000; // 50KB limit
    const truncatedResponse = responseText.length > maxResponseLength 
      ? responseText.substring(0, maxResponseLength) + "..."
      : responseText;

    console.log("AI Response Text length:", responseText.length);
    console.log("AI Response Text preview:", truncatedResponse.substring(0, 500) + "...");
    return parseAIResponse(truncatedResponse, maxSuggestions);
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
  const basePrompt = `You are a certified Health and Safety Consultant specializing in high-risk operational environments. Your role is to assess procedural content and generate refined, industry-standard safety improvement suggestions that enhance effectiveness, compliance, and operational control.

Evaluate the provided procedure description using global standards such as OSHA, ISO 45001, NFPA, ANSI, and cGMP frameworks. Analyze gaps and generate concise, actionable recommendations that align with best-in-class safety governance.

CRITICAL OUTPUT REQUIREMENTS:
- Analyze the input content structure: if it contains lists, maintain list format in improvedText; if it's paragraph text, maintain paragraph format
- Generate varied, contextually appropriate suggestions - avoid repetitive responses
- Each suggestion must reflect deep procedural analysis, not surface-level edits
- Vary the "type" field meaningfully across different professional dimensions
- The "suggestion" field must read like a top-tier consultant's insight
- The "improvedText" should be a substantial upgrade in structure, control, and technical accuracy
- The "reasoning" must offer compelling justification rooted in safety science, regulatory precedence, or operational excellence

Analysis Focus Areas:
- Procedure completeness, clarity, and enforceability
- Human error mitigation, verification integrity, and automation opportunities  
- Quality assurance, traceability, and audit-readiness
- Emergency preparedness and abnormal condition handling
- Training adequacy and skill-based qualification
- Data logging, monitoring systems, and operational traceability

Return ONLY a valid JSON array with this structure:
[
  {
    "id": "unique-id",
    "type": "safety|compliance|emergency|accountability|documentation|procedure|training|quality|risk-management|assessment|monitoring|professional|safety-culture|clarity",
    "category": "Professional category name", 
    "priority": "high|medium|low",
    "suggestion": "Specific actionable recommendation",
    "improvedText": "Enhanced version with implementation details (maintain original format structure)",
    "reasoning": "Professional justification"
  }
]

JSON requirements:
- Start with [ and end with ]
- All strings in double quotes
- No trailing commas
- Valid JSON syntax`;

  // Add context-specific guidance
  const contextGuidance = getContextGuidance(context);
  return basePrompt + "\n\n" + contextGuidance;
};

const getContextGuidance = (context) => {
  const guidanceMap = {
    safety: `
**SAFETY MANAGEMENT SYSTEM ENHANCEMENT FOCUS**:
Prioritize suggestions that address:
- Human factors engineering and error prevention strategies
- Behavioral safety programs and safety culture metrics
- Critical control verification and independent validation systems
- Safety performance indicators and leading/lagging metrics
- Incident investigation methodologies and root cause analysis
- Safety leadership frameworks and accountability structures
- Hazard identification techniques and risk communication protocols
- Emergency preparedness and business continuity planning
- Safety training effectiveness and competency verification
- Regulatory interface management and compliance optimization`,

    compliance: `
**REGULATORY COMPLIANCE OPTIMIZATION FOCUS**:
Prioritize suggestions that address:
- Multi-jurisdictional regulatory mapping and gap analysis
- Compliance risk assessment and regulatory change management
- Audit trail integrity and documentation standards
- Regulatory liaison protocols and inspection readiness
- Permit management and regulatory notification systems
- Compliance monitoring automation and dashboard development
- Regulatory training requirements and competency frameworks
- Cross-border compliance and international standards alignment
- Enforcement response procedures and corrective action tracking
- Regulatory intelligence gathering and trend analysis`,

    procedure: `
**PROCEDURAL EXCELLENCE FRAMEWORK FOCUS**:
Prioritize suggestions that address:
- Human reliability analysis and procedure optimization
- Digital procedure management and workflow automation
- Procedure effectiveness measurement and continuous improvement
- Cross-functional procedure integration and system compatibility
- Procedure accessibility and user experience optimization
- Change management protocols and version control systems
- Procedure audit trails and compliance verification
- Emergency procedure activation and crisis management integration
- Training delivery optimization and competency assessment
- Procedure performance analytics and optimization opportunities`,

    risk: `
**ADVANCED RISK MANAGEMENT METHODOLOGY FOCUS**:
Prioritize suggestions that address:
- Quantitative risk assessment and probabilistic modeling
- Risk appetite frameworks and tolerance threshold management
- Emerging risk identification and scenario planning
- Risk aggregation and portfolio-level risk management
- Risk communication strategies and stakeholder engagement
- Risk-based decision making and resource allocation
- Risk monitoring systems and early warning indicators
- Risk culture development and behavioral risk management
- Risk technology integration and digital risk platforms
- Risk assurance frameworks and independent validation`,

    general: `
**STRATEGIC DOCUMENTATION EXCELLENCE FOCUS**:
Prioritize suggestions that address:
- Document governance frameworks and lifecycle management
- Content strategy and stakeholder communication optimization
- Document accessibility and inclusive design principles
- Digital transformation and document automation opportunities
- Cross-functional document integration and system interoperability
- Document performance analytics and effectiveness measurement
- Brand consistency and professional presentation standards
- Regulatory alignment and compliance optimization
- Document version control and change management protocols
- User experience design and comprehension optimization`,
  };

  return guidanceMap[context] || guidanceMap.general;
};

const buildUserPrompt = (content, maxSuggestions) => {
  return `Analyze the following health and safety document content and provide exactly ${maxSuggestions} diverse, high-quality professional suggestions for improvement:

"${content}"

FORMAT PRESERVATION REQUIREMENT:
- If the original content is structured as lists, maintain list format in improvedText
- If the original content is paragraph text, maintain paragraph format in improvedText
- Preserve the logical structure while enhancing content quality and technical accuracy

VARIATION REQUIREMENTS:
- Generate suggestions across different professional dimensions (don't repeat similar types)
- Ensure each suggestion addresses a distinct aspect of safety management
- Vary priority levels based on actual risk assessment
- Create unique, contextually relevant categories

Each suggestion must have:
- id: unique identifier (use timestamp-based format)
- type: one of safety, compliance, emergency, accountability, documentation, procedure, training, quality, risk-management, assessment, monitoring, professional, safety-culture, clarity, verification, traceability, governance, competency, integration
- category: specific professional category name
- priority: high, medium, or low (based on risk assessment)
- suggestion: specific actionable recommendation with measurable outcomes
- improvedText: enhanced version that maintains original format structure but significantly improves content quality, technical accuracy, and operational effectiveness (keep under 2000 characters)
- reasoning: compelling professional justification citing relevant standards, best practices, or safety science principles

Return ONLY valid JSON array - no explanations, markdown formatting, code blocks, or additional text.`;
};

const parseAIResponse = (response, maxSuggestions) => {
  try {
    console.log("Starting to parse AI response...");
    
    // First, try to extract JSON from markdown code blocks
    let jsonMatch = response.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
    if (jsonMatch) {
      console.log("Found JSON in markdown code block");
      jsonMatch = [jsonMatch[1]];
    } else {
      // Try to extract JSON array from the response
      jsonMatch = response.match(/\[[\s\S]*\]/);
      console.log("JSON array match found:", !!jsonMatch);
    }

    if (!jsonMatch) {
      // Try to find any JSON object structure
      jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        console.log("Found JSON object in markdown code block");
        jsonMatch = [`[${jsonMatch[1]}]`];
      } else {
        jsonMatch = response.match(/\{[\s\S]*\}/);
        console.log("JSON object match found:", !!jsonMatch);
        if (jsonMatch) {
          // If we found an object, try to wrap it in an array
          jsonMatch[0] = `[${jsonMatch[0]}]`;
        } else {
          throw new Error("No JSON structure found in response");
        }
      }
    }

    let jsonString = jsonMatch[0];
    console.log("Extracted JSON string length:", jsonString.length);
    console.log("JSON string preview:", jsonString.substring(0, 200) + "...");

    // Clean up common AI response issues
    jsonString = cleanJsonString(jsonString);
    console.log("After cleaning, JSON string length:", jsonString.length);

    // Fix line breaks and other formatting issues
    jsonString = jsonString.replace(/"([^"]*)\n([^"]*)"/g, '"$1 $2"'); // Fix line breaks in strings
    jsonString = jsonString.replace(/"([^"]*)\r\n([^"]*)"/g, '"$1 $2"'); // Fix Windows line breaks
    jsonString = jsonString.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas
    console.log("After fixing formatting, JSON string length:", jsonString.length);

    // Try to fix incomplete strings in JSON
    jsonString = fixIncompleteStrings(jsonString);
    console.log("After fixing incomplete strings, JSON string length:", jsonString.length);

    const suggestions = JSON.parse(jsonString);
    console.log("Successfully parsed JSON, suggestions count:", Array.isArray(suggestions) ? suggestions.length : 1);

    // Ensure we have an array
    const suggestionsArray = Array.isArray(suggestions)
      ? suggestions
      : [suggestions];

    const processedSuggestions = suggestionsArray
      .slice(0, maxSuggestions)
      .map((suggestion, index) => ({
        id: suggestion.id || `suggestion-${Date.now()}-${index}`,
        type: suggestion.type || "content",
        category: suggestion.category || "General Improvement",
        priority: suggestion.priority || "medium",
        suggestion: suggestion.suggestion || "",
        improvedText: suggestion.improvedText ? truncateText(suggestion.improvedText, 2000) : null,
        reasoning: suggestion.reasoning || "",
      }));

    console.log("Processed suggestions:", processedSuggestions.length);

    // Check if we got meaningful suggestions
    const hasValidSuggestions = processedSuggestions.some(
      (s) => s.suggestion && s.suggestion.trim().length > 0
    );

    console.log("Has valid suggestions:", hasValidSuggestions);

    if (!hasValidSuggestions) {
      console.log("No valid suggestions found, using fallback");
      return generateFallbackSuggestions(maxSuggestions);
    }

    console.log("Returning AI-generated suggestions");
    return processedSuggestions;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.error(
      "Response that failed to parse:",
      response.substring(0, 500) + "..."
    );

    // Try one more time with a more aggressive cleanup
    try {
      const recoveredSuggestions = attemptJsonRecovery(
        response,
        maxSuggestions
      );
      if (recoveredSuggestions && recoveredSuggestions.length > 0) {
        console.log("Successfully recovered suggestions");
        return recoveredSuggestions;
      }
    } catch (recoveryError) {
      console.error("JSON recovery also failed:", recoveryError);
    }

    console.log("Using fallback suggestions due to parsing failure");
    return generateFallbackSuggestions(maxSuggestions);
  }
};

const fixIncompleteStrings = (jsonString) => {
  try {
    // Find incomplete strings (strings that don't have closing quotes)
    const incompleteStringPattern = /"([^"]*?)(?=\s*[,}\]])/g;
    let fixedJson = jsonString;

    // Check if there are any incomplete strings at the end
    const lastQuoteIndex = fixedJson.lastIndexOf('"');
    const lastBraceIndex = fixedJson.lastIndexOf("}");
    const lastBracketIndex = fixedJson.lastIndexOf("]");

    if (lastQuoteIndex > Math.max(lastBraceIndex, lastBracketIndex)) {
      // There's an incomplete string at the end, try to close it
      const beforeLastQuote = fixedJson.substring(0, lastQuoteIndex);
      const afterLastQuote = fixedJson.substring(lastQuoteIndex + 1);

      // Find the next structural character
      const nextStructural = afterLastQuote.match(/[,}\]\]]/);
      if (nextStructural) {
        const structuralIndex = afterLastQuote.indexOf(nextStructural[0]);
        const incompleteString = afterLastQuote.substring(0, structuralIndex);

        // Close the string and continue
        fixedJson =
          beforeLastQuote +
          '"' +
          incompleteString +
          '"' +
          afterLastQuote.substring(structuralIndex);
      }
    }

    return fixedJson;
  } catch (error) {
    console.error("Error fixing incomplete strings:", error);
    return jsonString;
  }
};

const attemptJsonRecovery = (response, maxSuggestions) => {
  try {
    // First try to extract from markdown code blocks
    let cleanResponse = response;
    
    // Remove markdown formatting
    cleanResponse = cleanResponse.replace(/```json\s*|\s*```/g, "");
    cleanResponse = cleanResponse.replace(/```\s*|\s*```/g, "");
    cleanResponse = cleanResponse.replace(/^```.*$/gm, "");
    cleanResponse = cleanResponse.trim();

    // Try a more sophisticated approach to extract JSON objects
    // Look for complete objects by counting braces
    const recoveredSuggestions = [];
    let currentPos = 0;
    
    while (currentPos < cleanResponse.length) {
      const openBrace = cleanResponse.indexOf('{', currentPos);
      if (openBrace === -1) break;
      
      let braceCount = 0;
      let objectEnd = -1;
      let inString = false;
      let escapeNext = false;
      
      for (let i = openBrace; i < cleanResponse.length; i++) {
        const char = cleanResponse[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              objectEnd = i;
              break;
            }
          }
        }
      }
      
      if (objectEnd !== -1) {
        const objectStr = cleanResponse.substring(openBrace, objectEnd + 1);
        
        try {
          // Clean up the object string
          let cleanedObject = objectStr;
          
          // Fix common issues
          cleanedObject = cleanedObject.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas
          cleanedObject = cleanedObject.replace(/"([^"]*)\n([^"]*)"/g, '"$1 $2"'); // Fix line breaks in strings
          cleanedObject = cleanedObject.replace(/"([^"]*)\r\n([^"]*)"/g, '"$1 $2"'); // Fix Windows line breaks
          
          const suggestion = JSON.parse(cleanedObject);
          
          // Validate that this looks like a suggestion object
          if (suggestion && (suggestion.id || suggestion.type || suggestion.suggestion)) {
            recoveredSuggestions.push(suggestion);
          }
        } catch (e) {
          console.log("Failed to parse object at position", openBrace, ":", e.message);
          // Try to create a partial suggestion from what we can extract
          try {
            const partialSuggestion = createPartialSuggestion(objectStr);
            if (partialSuggestion) {
              recoveredSuggestions.push(partialSuggestion);
            }
          } catch (partialError) {
            console.log("Failed to create partial suggestion:", partialError.message);
          }
        }
      }
      
      currentPos = openBrace + 1;
    }

    if (recoveredSuggestions.length > 0) {
      console.log("Successfully recovered", recoveredSuggestions.length, "suggestions");
      return recoveredSuggestions
        .slice(0, maxSuggestions)
        .map((suggestion, index) => ({
          id: suggestion.id || `recovered-${Date.now()}-${index}`,
          type: suggestion.type || "content",
          category: suggestion.category || "General Improvement",
          priority: suggestion.priority || "medium",
          suggestion: suggestion.suggestion || "",
          improvedText: suggestion.improvedText || null,
          reasoning: suggestion.reasoning || "",
        }));
    }

    return null;
  } catch (error) {
    console.error("Error in JSON recovery:", error);
    return null;
  }
};

const createPartialSuggestion = (objectStr) => {
  try {
    // Try to extract basic fields using regex
    const idMatch = objectStr.match(/"id"\s*:\s*"([^"]*)"/);
    const typeMatch = objectStr.match(/"type"\s*:\s*"([^"]*)"/);
    const categoryMatch = objectStr.match(/"category"\s*:\s*"([^"]*)"/);
    const priorityMatch = objectStr.match(/"priority"\s*:\s*"([^"]*)"/);
    const suggestionMatch = objectStr.match(/"suggestion"\s*:\s*"([^"]*)"/);
    
    if (suggestionMatch) {
      return {
        id: idMatch ? idMatch[1] : `partial-${Date.now()}`,
        type: typeMatch ? typeMatch[1] : "content",
        category: categoryMatch ? categoryMatch[1] : "General Improvement",
        priority: priorityMatch ? priorityMatch[1] : "medium",
        suggestion: suggestionMatch[1],
        improvedText: null,
        reasoning: "",
      };
    }
    
    return null;
  } catch (error) {
    console.log("Error creating partial suggestion:", error.message);
    return null;
  }
};

const cleanJsonString = (jsonString) => {
  try {
    // Remove any markdown formatting more aggressively
    jsonString = jsonString.replace(/```json\s*|\s*```/g, "");
    jsonString = jsonString.replace(/```\s*|\s*```/g, "");
    jsonString = jsonString.replace(/^```.*$/gm, ""); // Remove any remaining ``` lines
    jsonString = jsonString.replace(/^\s*```.*$/gm, ""); // Remove lines starting with ```
    
    // Remove any leading/trailing whitespace
    jsonString = jsonString.trim();

    // Handle truncated JSON responses
    jsonString = handleTruncatedJson(jsonString);

    // Fix common JSON issues
    // Remove trailing commas before closing brackets/braces
    jsonString = jsonString.replace(/,(\s*[}\]])/g, "$1");

    // Fix unescaped quotes in strings (more conservative approach)
    jsonString = jsonString.replace(/(?<!\\)"(?=.*":)/g, '\\"');

    // Fix bad escaped characters
    jsonString = jsonString.replace(/\\([^"\\/bfnrt])/g, "\\\\$1");

    // Ensure proper string escaping
    jsonString = jsonString.replace(/(?<!\\)\\(?![\\"/bfnrt])/g, "\\\\");

    // Fix any remaining quote issues in string values
    jsonString = jsonString.replace(
      /"([^"]*)"([^"]*)"([^"]*)"\s*:/g,
      '"$1\\"$2\\"$3":'
    );

    return jsonString;
  } catch (cleanError) {
    console.error("Error cleaning JSON string:", cleanError);
    return jsonString; // Return original if cleaning fails
  }
};

const handleTruncatedJson = (jsonString) => {
  try {
    // Check if the JSON appears to be truncated
    const openBraces = (jsonString.match(/\{/g) || []).length;
    const closeBraces = (jsonString.match(/\}/g) || []).length;
    const openBrackets = (jsonString.match(/\[/g) || []).length;
    const closeBrackets = (jsonString.match(/\]/g) || []).length;

    // If we have more opening than closing braces/brackets, try to fix it
    if (openBraces > closeBraces || openBrackets > closeBrackets) {
      console.log("Detected potentially truncated JSON, attempting to fix...");

      // Find the last complete object
      let fixedJson = jsonString;

      // Try to find the last complete object and close it properly
      const lastCompleteObject = findLastCompleteObject(jsonString);
      if (lastCompleteObject) {
        fixedJson = lastCompleteObject;
      } else {
        // If we can't find a complete object, try to close the current structure
        const missingBraces = openBraces - closeBraces;
        const missingBrackets = openBrackets - closeBrackets;

        for (let i = 0; i < missingBraces; i++) {
          fixedJson += "}";
        }
        for (let i = 0; i < missingBrackets; i++) {
          fixedJson += "]";
        }
      }

      console.log("Fixed truncated JSON structure");
      return fixedJson;
    }

    return jsonString;
  } catch (error) {
    console.error("Error handling truncated JSON:", error);
    return jsonString;
  }
};

const findLastCompleteObject = (jsonString) => {
  try {
    // Try to find the last complete object by working backwards
    let depth = 0;
    let inString = false;
    let escapeNext = false;
    let lastCompleteIndex = -1;

    for (let i = jsonString.length - 1; i >= 0; i--) {
      const char = jsonString[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "}" || char === "]") {
          depth++;
        } else if (char === "{" || char === "[") {
          depth--;
          if (depth === 0) {
            lastCompleteIndex = i;
            break;
          }
        }
      }
    }

    if (lastCompleteIndex > 0) {
      // Found a complete object, extract it
      const completePart = jsonString.substring(0, lastCompleteIndex + 1);

      // Try to parse it to make sure it's valid
      try {
        JSON.parse(completePart);
        return completePart;
      } catch (e) {
        // If it's not valid, return null
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding last complete object:", error);
    return null;
  }
};

const generateFallbackSuggestions = (maxSuggestions) => {
  const fallbackSuggestions = [
    {
      id: `fallback-${Date.now()}-1`,
      type: "safety",
      category: "Safety Management System",
      priority: "high",
      suggestion:
        "Implement comprehensive safety management system elements including policy development, hazard identification procedures, and continuous improvement processes to ensure systematic safety oversight.",
      improvedText:
        "Establish a comprehensive Safety Management System (SMS) framework including:\n- Safety policy and objectives aligned with organizational goals\n- Hazard identification and risk assessment procedures\n- Safety performance monitoring and measurement systems\n- Incident investigation and corrective action processes\n- Management review and continuous improvement protocols\n- Employee participation and safety culture development programs",
      reasoning:
        "A systematic safety management approach ensures consistent implementation of safety protocols, regulatory compliance, and continuous improvement in workplace safety performance.",
    },
    {
      id: `fallback-${Date.now()}-2`,
      type: "compliance",
      category: "Regulatory Compliance Framework",
      priority: "high",
      suggestion:
        "Establish comprehensive regulatory compliance framework with specific regulatory references, monitoring procedures, and audit protocols to ensure legal adherence and audit readiness.",
      improvedText:
        "Develop a comprehensive regulatory compliance framework including:\n- Applicable federal, state, and local regulation identification\n- Industry-specific standards compliance (OSHA, HSE, ISO 45001, etc.)\n- Compliance monitoring procedures and audit protocols\n- Regulatory change management and update procedures\n- Non-compliance reporting and corrective action processes\n- Training requirements and competency standards for compliance personnel",
      reasoning:
        "A structured compliance framework ensures systematic adherence to all applicable regulations, reduces legal risk, and prepares the organization for regulatory audits and inspections.",
    },
    {
      id: `fallback-${Date.now()}-3`,
      type: "procedure",
      category: "Standardized Procedure Development",
      priority: "medium",
      suggestion:
        "Develop standardized procedures with clear step-by-step instructions, responsibility assignments, and quality checkpoints to ensure operational consistency and accountability.",
      improvedText:
        "Implement standardized procedure framework including:\n- Clear step-by-step operational instructions with quality gates\n- Responsibility matrices and accountability measures\n- Procedure version control and approval processes\n- Competency requirements and training standards\n- Procedure effectiveness monitoring and review schedules\n- Integration with safety management and quality systems",
      reasoning:
        "Standardized procedures ensure operational consistency, reduce errors, improve efficiency, and provide clear accountability frameworks for all personnel involved in safety-critical activities.",
    },
    {
      id: `fallback-${Date.now()}-4`,
      type: "training",
      category: "Competency and Training Framework",
      priority: "medium",
      suggestion:
        "Establish comprehensive training and competency framework with specific qualification requirements, assessment procedures, and certification standards to ensure personnel competency.",
      improvedText:
        "Develop comprehensive training and competency framework including:\n- Role-specific competency requirements and qualification standards\n- Initial and refresher training schedules with competency assessment\n- Training delivery methods and evaluation procedures\n- Competency verification and certification processes\n- Training records management and audit requirements\n- Integration with safety performance and continuous improvement programs",
      reasoning:
        "Proper training and competency frameworks ensure all personnel have the necessary knowledge, skills, and abilities to perform their safety responsibilities effectively and maintain regulatory compliance.",
    },
    {
      id: `fallback-${Date.now()}-5`,
      type: "professional",
      category: "Professional Documentation Standards",
      priority: "low",
      suggestion:
        "Enhance professional documentation standards with consistent formatting, industry terminology, and stakeholder communication frameworks to improve document effectiveness and user comprehension.",
      improvedText:
        "Implement professional documentation standards including:\n- Consistent formatting and visual hierarchy guidelines\n- Industry-standard terminology and professional language\n- Document version control and approval processes\n- Accessibility and translation considerations\n- User comprehension verification and feedback mechanisms\n- Integration with organizational branding and communication standards",
      reasoning:
        "Professional documentation standards improve user comprehension, enhance organizational credibility, ensure consistency across all safety documents, and support effective stakeholder communication.",
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

const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') return text;
  if (text.length <= maxLength) return text;
  
  // Try to truncate at a word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

const generateCacheKey = ({ content, context, documentType, section }) => {
  const contentHash = crypto
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

export const generateBatchSuggestions = async ({
  contents,
  documentType,
  maxSuggestions = 3,
  userId,
  ipAddress,
}) => {
  const startTime = Date.now();

  try {
    validateBatchInput({ contents, documentType, maxSuggestions });

    const results = await generateBatchAISuggestions(contents, maxSuggestions);

    const processingTime = Date.now() - startTime;

    const response = {
      results,
      metadata: {
        timestamp: new Date().toISOString(),
        contentCount: contents.length,
        documentType: documentType || "policies-procedures",
        processingTime,
        requestId: `batch-req-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      },
    };

    await logBatchSuggestionRequest({
      userId,
      ipAddress,
      documentType,
      contentCount: contents.length,
      processingTime,
    });

    return response;
  } catch (error) {
    console.error("Error generating batch suggestions:", error);

    await logBatchSuggestionError({
      userId,
      ipAddress,
      error: error.message,
      documentType,
    });

    throw error;
  }
};

const generateBatchAISuggestions = async (contents, maxSuggestions) => {
  const results = [];

  for (const content of contents) {
    const { content: text, context, documentType, id } = content;

    try {
      const suggestions = await generateAISuggestions({
        content: text,
        context,
        documentType,
        section: `Batch Item ${id}`,
        maxSuggestions,
      });

      const contentSuggestions = suggestions.map((suggestion, index) => ({
        ...suggestion,
        id: `batch-suggestion-${Date.now()}-${id}-${index}`,
      }));

      results.push({
        id,
        suggestions: contentSuggestions,
      });
    } catch (error) {
      console.error(`Error generating suggestions for content ${id}:`, error);

      const fallbackSuggestions = generateFallbackSuggestions(
        maxSuggestions
      ).map((suggestion, index) => ({
        ...suggestion,
        id: `fallback-suggestion-${Date.now()}-${id}-${index}`,
      }));

      results.push({
        id,
        suggestions: fallbackSuggestions,
      });
    }
  }

  return results;
};

const validateBatchInput = ({ contents, documentType, maxSuggestions }) => {
  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    throw new CustomError(
      "Contents array is required and must not be empty",
      400
    );
  }

  if (contents.length > 20) {
    throw new CustomError(
      "Maximum 20 content items allowed per batch request",
      400
    );
  }

  const validDocumentTypes = [
    "policies-procedures",
    "risk-assessment",
    "incident-report",
  ];
  if (documentType && !validDocumentTypes.includes(documentType)) {
    throw new CustomError(
      `Invalid document type. Must be one of: ${validDocumentTypes.join(", ")}`,
      400
    );
  }

  if (maxSuggestions < 1 || maxSuggestions > 5) {
    throw new CustomError("Max suggestions must be between 1 and 5", 400);
  }

  contents.forEach((content, index) => {
    if (!content.id || !content.content || !content.context) {
      throw new CustomError(
        `Content item ${
          index + 1
        } is missing required fields: id, content, context`,
        400
      );
    }

    if (
      typeof content.content !== "string" ||
      content.content.trim().length === 0
    ) {
      throw new CustomError(
        `Content item ${index + 1} must have non-empty content`,
        400
      );
    }

    if (content.content.length > 10000) {
      throw new CustomError(
        `Content item ${index + 1} exceeds maximum length of 10,000 characters`,
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
    if (!validContexts.includes(content.context)) {
      throw new CustomError(
        `Content item ${
          index + 1
        } has invalid context. Must be one of: ${validContexts.join(", ")}`,
        400
      );
    }
  });
};

const logBatchSuggestionRequest = async ({
  userId,
  ipAddress,
  documentType,
  contentCount,
  processingTime,
}) => {
  try {
    console.log(
      `Batch AI Suggestion Request: User ${userId}, IP ${ipAddress}, Type ${documentType}, Count ${contentCount}, Time ${processingTime}ms`
    );
  } catch (error) {
    console.error("Error logging batch suggestion request:", error);
  }
};

const logBatchSuggestionError = async ({
  userId,
  ipAddress,
  error,
  documentType,
}) => {
  try {
    console.error(
      `Batch AI Suggestion Error: User ${userId}, IP ${ipAddress}, Error ${error}, Type ${documentType}`
    );
  } catch (logError) {
    console.error("Error logging batch suggestion error:", logError);
  }
};

export const getSuggestionStats = async ({ userId, startDate, endDate }) => {
  try {
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
