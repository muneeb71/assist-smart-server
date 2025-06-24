import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

export const createResponsePlanService = async ({
  userId,
  companyBrandingId,
  emergencyType,
  evacuationMaps = [], // array of imageUrl
  fireWardens = [], // array of names
  floorWardens = [], // array of names
}) => {
  try {
    // 1. Generate content with GPT-4 (placeholder)
    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const responsePlan = await prisma.responsePlan.create({
      data: {
        userId,
        companyBrandingId,
        emergencyType,
        gcpFileUrl: null, // Set after upload
        evacuationMaps: {
          create: evacuationMaps.map((imageUrl) => ({ imageUrl })),
        },
        fireWardens: {
          create: fireWardens.map((name) => ({ name })),
        },
        floorWardens: {
          create: floorWardens.map((name) => ({ name })),
        },
      },
      include: { evacuationMaps: true, fireWardens: true, floorWardens: true, companyBranding: true },
    });
    return { success: true, data: responsePlan };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listResponsePlansService = async ({ userId }) => {
  try {
    const list = await prisma.responsePlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { evacuationMaps: true, fireWardens: true, floorWardens: true, companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getResponsePlanService = async ({ id, userId }) => {
  try {
    const doc = await prisma.responsePlan.findFirst({
      where: { id, userId },
      include: { evacuationMaps: true, fireWardens: true, floorWardens: true, companyBranding: true },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteResponsePlanService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.responsePlan.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 