import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

export const createSitePermissionService = async ({
  userId,
  companyBrandingId,
  location,
  date,
  time,
  activityType,
  permitApplicantName,
  permitHolderName,
  supervisorName,
  descriptionOfWork,
  permitValidity,
  permitExtension,
  permitApproverName,
  permitClosureDate,
  participants = [], // array of names
}) => {
  try {
    // 1. Generate content with GPT-4 (placeholder)
    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const sitePermission = await prisma.sitePermission.create({
      data: {
        userId,
        companyBrandingId,
        location,
        date: new Date(date),
        time,
        activityType,
        permitApplicantName,
        permitHolderName,
        supervisorName,
        descriptionOfWork,
        permitValidity,
        permitExtension,
        permitApproverName,
        permitClosureDate: new Date(permitClosureDate),
        gcpFileUrl: null, // Set after upload
        participants: {
          create: participants.map((name) => ({ name })),
        },
      },
      include: { participants: true, companyBranding: true },
    });
    return { success: true, data: sitePermission };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listSitePermissionsService = async ({ userId }) => {
  try {
    const list = await prisma.sitePermission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { participants: true, companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getSitePermissionService = async ({ id, userId }) => {
  try {
    const doc = await prisma.sitePermission.findFirst({
      where: { id, userId },
      include: { participants: true, companyBranding: true },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteSitePermissionService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.sitePermission.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 