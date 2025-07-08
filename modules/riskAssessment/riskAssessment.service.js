import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";
import { streamUsingGemini } from "../../lib/generateContent.js";
import { getRiskAssessmentPrompt } from "../../lib/prompts.js";

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

  const parsedUserId = Number(userId);
  const parsedCompanyBrandingId = Number(companyBrandingId);

  if (isNaN(parsedUserId)) {
    throw new Error("Invalid userId: must be a number");
  }
  if (isNaN(parsedCompanyBrandingId)) {
    throw new Error("Invalid companyBrandingId: must be a number");
  }

  let companyBrandingIdToUse = parsedCompanyBrandingId;

  const companyBranding = await prisma.companyBranding.findUnique({
    where: { id: parsedCompanyBrandingId },
    select: { id: true },
  });

  if (!companyBranding) {
    const newCompanyBranding = await prisma.companyBranding.create({
      data: {
        name: "Default Company Name",
        documentControlNumber: "N/A",
        logo: "",
      },
    });
    companyBrandingIdToUse = newCompanyBranding.id;
  }

  let fullText = "";

  async function* stream() {
    yield* (async function* () {
      for await (const chunk of streamUsingGemini(prompt)) {
        fullText += chunk;
        yield chunk;
      }
    })();

    await prisma.riskAssessment.create({
      data: {
        userId: parsedUserId,
        companyBrandingId: parsedCompanyBrandingId,
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
        // generatedContent: fullText,
      },
    });
  }

  return stream();
};

export const updateRiskAssessmentService = async ({ id, userId, updateData }) => {
  try {
    // Ensure the document exists and belongs to the user
    const existing = await prisma.riskAssessment.findFirst({ where: { id, userId } });
    if (!existing) throw new CustomError('Not found', 404);
    const updated = await prisma.riskAssessment.update({
      where: { id },
      data: updateData,
    });
    return { success: true, data: updated };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};
