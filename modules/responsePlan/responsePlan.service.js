import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';
import { getResponsePlanPrompt } from '../../lib/prompts.js';
import { generateUsingGemini, streamUsingGemini } from '../../lib/generateContent.js';

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

export const streamResponsePlanService = async ({
  userId,
  companyBrandingId,
  emergencyType,
  evacuationMaps = [],
  fireWardens = [],
  floorWardens = [],
}) => {
  const prompt = getResponsePlanPrompt(
    emergencyType,
    evacuationMaps,
    fireWardens,
    floorWardens
  );

  const parsedUserId = Number(userId);
  const parsedCompanyBrandingId = Number(companyBrandingId);

  if (isNaN(parsedUserId)) {
    throw new Error('Invalid userId: must be a number');
  }
  if (isNaN(parsedCompanyBrandingId)) {
    throw new Error('Invalid companyBrandingId: must be a number');
  }

  let companyBrandingIdToUse = parsedCompanyBrandingId;

  const companyBranding = await prisma.companyBranding.findUnique({
    where: { id: parsedCompanyBrandingId },
    select: { id: true },
  });

  if (!companyBranding) {
    const newCompanyBranding = await prisma.companyBranding.create({
      data: {
        name: 'Default Company Name',
        documentControlNumber: 'N/A',
        logo: '',
      },
    });
    companyBrandingIdToUse = newCompanyBranding.id;
  }

  let fullText = '';

  async function* stream() {
    yield* (async function* () {
      for await (const chunk of streamUsingGemini(prompt)) {
        fullText += chunk;
        yield chunk;
      }
    })();

    // Save to DB after streaming completes
    await prisma.responsePlan.create({
      data: {
        userId: parsedUserId,
        companyBrandingId: companyBrandingIdToUse,
        emergencyType,
        gcpFileUrl: null,
        // generatedContent: fullText,
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
    });
  }

  return stream();
}; 