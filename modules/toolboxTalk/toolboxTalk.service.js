import prisma from '../../config/prisma.js';
import { CustomError } from '../../lib/customError.js';

// Placeholder for GPT-4 and GCP integrations

export const createToolboxTalkService = async ({
  userId,
  companyBrandingId,
  topic,
  keyPoints,
  numberOfParticipants,
  date,
  time,
  trainingMedia = [], // array of imageUrl
}) => {
  try {
    // 1. Generate content with GPT-4 (placeholder)
    // 2. Fill doc template (placeholder)
    // 3. Upload to GCP bucket (placeholder)
    // 4. Save metadata in DB
    const toolboxTalk = await prisma.toolboxTalk.create({
      data: {
        userId,
        companyBrandingId,
        topic,
        keyPoints,
        numberOfParticipants,
        date: new Date(date),
        time,
        gcpFileUrl: null, // Set after upload
        trainingMedia: {
          create: trainingMedia.map((imageUrl) => ({ imageUrl })),
        },
      },
      include: { trainingMedia: true, companyBranding: true },
    });
    return { success: true, data: toolboxTalk };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const listToolboxTalksService = async ({ userId }) => {
  try {
    const list = await prisma.toolboxTalk.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { trainingMedia: true, companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const getToolboxTalkService = async ({ id, userId }) => {
  try {
    const doc = await prisma.toolboxTalk.findFirst({
      where: { id, userId },
      include: { trainingMedia: true, companyBranding: true },
    });
    if (!doc) throw new CustomError('Not found', 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
};

export const deleteToolboxTalkService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.toolboxTalk.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(err.message || 'Internal Server Error', err.statusCode || 500);
  }
}; 