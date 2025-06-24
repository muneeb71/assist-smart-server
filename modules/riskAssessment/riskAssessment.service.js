import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

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
    // 1. Generate content with GPT-4 (placeholder)
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
        gcpFileUrl: null, // Set after upload
      },
    });
    return { success: true, data: riskAssessment };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listRiskAssessmentsService = async ({ userId }) => {
  try {
    const list = await prisma.riskAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getRiskAssessmentService = async ({ id, userId }) => {
  try {
    const doc = await prisma.riskAssessment.findFirst({
      where: { id, userId },
      include: { companyBranding: true },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteRiskAssessmentService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.riskAssessment.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 