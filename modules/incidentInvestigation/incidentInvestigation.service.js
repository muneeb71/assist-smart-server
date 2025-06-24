import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

export const createIncidentInvestigationService = async ({
  userId,
  companyBrandingId,
  incidentCategory,
  description,
  date,
  time,
  location,
  supervisor,
  reportedBy,
  incidentDetails,
  investigationDetails,
  participants = [], // array of names
  witnesses = [], // array of names
  departments = [], // array of names
  immediateCausesUnsafeActs = [], // array of names
  immediateCausesUnsafeConditions = [], // array of names
  rootCausesPersonalFactors = [], // array of names
}) => {
  try {
    // 1. Generate content with GPT-4 (placeholder)
    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const incidentInvestigation = await prisma.incidentInvestigation.create({
      data: {
        userId,
        companyBrandingId,
        incidentCategory,
        description,
        date: new Date(date),
        time,
        location,
        supervisor,
        reportedBy,
        incidentDetails,
        investigationDetails,
        gcpFileUrl: null, // Set after upload
        participants: {
          create: participants.map((name) => ({ name })),
        },
        witnesses: {
          create: witnesses.map((name) => ({ name })),
        },
        departments: {
          create: departments.map((name) => ({ name })),
        },
        immediateCausesUnsafeActs: {
          create: immediateCausesUnsafeActs.map((name) => ({ name })),
        },
        immediateCausesUnsafeConditions: {
          create: immediateCausesUnsafeConditions.map((name) => ({ name })),
        },
        rootCausesPersonalFactors: {
          create: rootCausesPersonalFactors.map((name) => ({ name })),
        },
      },
      include: {
        participants: true,
        witnesses: true,
        departments: true,
        immediateCausesUnsafeActs: true,
        immediateCausesUnsafeConditions: true,
        rootCausesPersonalFactors: true,
        companyBranding: true,
      },
    });
    return { success: true, data: incidentInvestigation };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listIncidentInvestigationsService = async ({ userId }) => {
  try {
    const list = await prisma.incidentInvestigation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        participants: true,
        witnesses: true,
        departments: true,
        immediateCausesUnsafeActs: true,
        immediateCausesUnsafeConditions: true,
        rootCausesPersonalFactors: true,
        companyBranding: true,
      },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getIncidentInvestigationService = async ({ id, userId }) => {
  try {
    const doc = await prisma.incidentInvestigation.findFirst({
      where: { id, userId },
      include: {
        participants: true,
        witnesses: true,
        departments: true,
        immediateCausesUnsafeActs: true,
        immediateCausesUnsafeConditions: true,
        rootCausesPersonalFactors: true,
        companyBranding: true,
      },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteIncidentInvestigationService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.incidentInvestigation.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 