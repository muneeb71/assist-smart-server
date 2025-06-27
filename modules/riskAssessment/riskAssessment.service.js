import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";
import {
  generateUsingGemini,
  streamUsingGemini,
} from "../../lib/generateContent.js";
import {
  getRiskAssessmentPrompt,
  getRiskAssessmentChapterTablePrompt,
  getRiskAssessmentStructurePrompt,
} from "../../lib/prompts.js";

export const createRiskAssessmentService = async ({
  userId,
  companyBrandingId,
  industry,
  activityType,
  location,
  existingControlMeasures,
  responsibleDepartments,
  preparedBy,
  preparedByOccupation,
  reviewedBy,
  reviewedByOccupation,
  approvedBy,
  approvedByOccupation,
}) => {
  try {
    const prompt = getRiskAssessmentPrompt(
      industry,
      activityType,
      location,
      existingControlMeasures,
      responsibleDepartments
    );
    const generatedContent = await generateUsingGemini(prompt);

    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const riskAssessment = await prisma.riskAssessment.create({
      data: {
        userId,
        companyBrandingId,
        industry,
        activityType,
        location,
        existingControlMeasures,
        responsibleDepartments,
        preparedBy,
        preparedByOccupation,
        reviewedBy,
        reviewedByOccupation,
        approvedBy,
        approvedByOccupation,
        gcpFileUrl: null,
        generatedContent,
      },
    });
    return { success: true, data: riskAssessment };
  } catch (err) {
    throw new CustomError(
      err?.message || "Internal Server Error",
      err?.statusCode || 500
    );
  }
};

export const listRiskAssessmentsService = async ({ userId }) => {
  try {
    const list = await prisma.riskAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const getRiskAssessmentService = async ({ id, userId }) => {
  try {
    const doc = await prisma.riskAssessment.findFirst({
      where: { id, userId },
      include: { companyBranding: true },
    });
    if (!doc) throw new CustomError("Not found", 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const deleteRiskAssessmentService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.riskAssessment.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const streamRiskAssessmentService = async ({
  userId,
  companyBrandingId,
  industry,
  activityType,
  location,
  existingControlMeasures,
  responsibleDepartments,
  preparedBy,
  preparedByOccupation,
  reviewedBy,
  reviewedByOccupation,
  approvedBy,
  approvedByOccupation,
}) => {
  const prompt = getRiskAssessmentPrompt(
    industry,
    activityType,
    location,
    existingControlMeasures,
    responsibleDepartments
  );
  let fullText = "";
  // This is an async generator
  async function* stream() {
    yield* (async function* () {
      for await (const chunk of streamUsingGemini(prompt)) {
        fullText += chunk;
        yield chunk;
      }
    })();
    // Save to DB after streaming is done
    await prisma.riskAssessment.create({
      data: {
        userId,
        companyBrandingId,
        industry,
        activityType,
        location,
        existingControlMeasures,
        responsibleDepartments,
        preparedBy,
        preparedByOccupation,
        reviewedBy,
        reviewedByOccupation,
        approvedBy,
        approvedByOccupation,
        gcpFileUrl: null,
        generatedContent: fullText,
      },
    });
  }
  return stream();
};

export const generateRiskAssessmentStructureService = async ({ industry }) => {
  const prompt = getRiskAssessmentStructurePrompt(industry);
  const result = await generateUsingGemini(prompt);
  let parsed = "";
  try {
    parsed = JSON.parse(result.replace(/^```json|^```|```$/gim, "").trim());
  } catch (e) {
    throw new CustomError("Failed to parse Gemini response as JSON", 500);
  }
  return parsed;
};

export const generateRiskAssessmentChapterTableService = async ({ chapterDetails }) => {
  const promises = chapterDetails.map(async (c) => {
    const prompt = getRiskAssessmentChapterTablePrompt(c.chapterName, c.activities);
    const result = await generateUsingGemini(prompt);
    let parsed;
    try {
      parsed = JSON.parse(result.replace(/^```json|^```|```$/gim, "").trim());
    } catch (e) {
      throw new CustomError(`Failed to parse Gemini response for chapter ${c.chapterName} as JSON`, 500);
    }
    return parsed;
  });
  const detailedChapters = await Promise.all(promises);
  return detailedChapters;
};
