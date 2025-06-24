import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

export const createMethodStatementService = async ({
  userId,
  companyBrandingId,
  activityName,
  toolsAndEquipment,
  numberOfPeople,
  activityBrief,
  safetyMeasures = [],
  staffPersons = [],
}) => {
  try {
    // 1. Generate content with GPT-4 (placeholder)
    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const methodStatement = await prisma.methodStatement.create({
      data: {
        userId,
        companyBrandingId,
        activityName,
        toolsAndEquipment,
        numberOfPeople,
        activityBrief,
        gcpFileUrl: null, // Set after upload
        safetyMeasures: {
          create: safetyMeasures.map((name) => ({ name })),
        },
        staffPersons: {
          create: staffPersons.map(({ name, position, mobileNumber }) => ({ name, position, mobileNumber })),
        },
      },
      include: { safetyMeasures: true, staffPersons: true, companyBranding: true },
    });
    return { success: true, data: methodStatement };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listMethodStatementsService = async ({ userId }) => {
  try {
    const list = await prisma.methodStatement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { safetyMeasures: true, staffPersons: true, companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getMethodStatementService = async ({ id, userId }) => {
  try {
    const doc = await prisma.methodStatement.findFirst({
      where: { id, userId },
      include: { safetyMeasures: true, staffPersons: true, companyBranding: true },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteMethodStatementService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.methodStatement.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const createSafetyMeasureService = async ({ name, imageUrl }) => {
  try {
    const safetyMeasure = await prisma.safetyMeasure.create({
      data: { name, imageUrl },
    });
    return { success: true, data: safetyMeasure };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listSafetyMeasuresService = async () => {
  try {
    const list = await prisma.safetyMeasure.findMany({ orderBy: { createdAt: 'desc' } });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 