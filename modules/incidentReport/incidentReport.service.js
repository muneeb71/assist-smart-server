import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';
import { getIncidentReportPrompt } from '../../lib/prompts.js';
import { generateUsingGemini, streamUsingGemini } from '../../lib/generateContent.js';

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

export const streamIncidentReportService = async ({
  userId,
  companyBrandingId,
  incidentType,
  description,
  date,
  time,
  location,
}) => {
  const prompt = getIncidentReportPrompt(
    incidentType,
    description,
    date,
    time,
    location
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
    await prisma.incidentReport.create({
      data: {
        userId: parsedUserId,
        companyBrandingId: companyBrandingIdToUse,
        incidentType,
        description,
        date: new Date(date),
        time,
        location,
        gcpFileUrl: null,
        // generatedContent: fullText,
      },
    });
  }

  return stream();
}; 