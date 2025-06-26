import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";
import { generateUsingGemini } from "../../lib/generateContent.js";
import { getRiskAssessmentPrompt } from "../../lib/prompts.js";

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

    let cleanedContent = generatedContent.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    }
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedContent);
    } catch (e) {
      throw new CustomError("Failed to parse generated content as JSON", 500);
    }

    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const data = {
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
      generatedContent: parsedContent,
    };

    // const riskAssessment = await prisma.riskAssessment.create({
    //   data,
    // });

    return { success: true, data: data };
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
