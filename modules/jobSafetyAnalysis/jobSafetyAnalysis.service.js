import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';
import { getJobSafetyAnalysisPrompt } from '../../lib/prompts.js';
import { generateUsingGemini, streamUsingGemini } from '../../lib/generateContent.js';

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

export const streamJobSafetyAnalysisService = async ({
  userId,
  companyBrandingId,
  activityType,
  date,
  time,
  numberOfWorkers,
  knownHazards,
  participantNames,
}) => {
  const prompt = getJobSafetyAnalysisPrompt(
    activityType,
    date,
    time,
    numberOfWorkers,
    knownHazards,
    participantNames
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
    await prisma.jobSafetyAnalysis.create({
      data: {
        userId: parsedUserId,
        companyBrandingId: companyBrandingIdToUse,
        activityType,
        date: new Date(date),
        time,
        numberOfWorkers,
        knownHazards,
        participantNames,
        gcpFileUrl: null,
        // generatedContent: fullText,
      },
    });
  }

  return stream();
}; 