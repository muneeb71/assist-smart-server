import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

export const createIncidentReportService = async ({
  userId,
  companyBrandingId,
  incidentType,
  description,
  date,
  time,
  location,
}) => {
  try {
    // 1. Generate content with GPT-4 (placeholder)
    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const incidentReport = await prisma.incidentReport.create({
      data: {
        userId,
        companyBrandingId,
        incidentType,
        description,
        date: new Date(date),
        time,
        location,
        gcpFileUrl: null, // Set after upload
      },
      include: { companyBranding: true },
    });
    return { success: true, data: incidentReport };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listIncidentReportsService = async ({ userId }) => {
  try {
    const list = await prisma.incidentReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getIncidentReportService = async ({ id, userId }) => {
  try {
    const doc = await prisma.incidentReport.findFirst({
      where: { id, userId },
      include: { companyBranding: true },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteIncidentReportService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.incidentReport.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 