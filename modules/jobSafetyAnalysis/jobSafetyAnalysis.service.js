import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

export const createJobSafetyAnalysisService = async ({
  userId,
  companyBrandingId,
  activityType,
  date,
  time,
  numberOfWorkers,
  knownHazards,
  participantNames,
}) => {
  try {
    // 1. Generate content with GPT-4 (placeholder)
    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const jobSafetyAnalysis = await prisma.jobSafetyAnalysis.create({
      data: {
        userId,
        companyBrandingId,
        activityType,
        date: new Date(date),
        time,
        numberOfWorkers,
        knownHazards,
        participantNames,
        gcpFileUrl: null, // Set after upload
      },
    });
    return { success: true, data: jobSafetyAnalysis };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listJobSafetyAnalysesService = async ({ userId }) => {
  try {
    const list = await prisma.jobSafetyAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getJobSafetyAnalysisService = async ({ id, userId }) => {
  try {
    const doc = await prisma.jobSafetyAnalysis.findFirst({
      where: { id, userId },
      include: { companyBranding: true },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteJobSafetyAnalysisService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.jobSafetyAnalysis.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 