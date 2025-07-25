import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";
import { streamUsingGemini } from "../../lib/generateContent.js";
import { getDocumentPrompt } from "../../lib/prompts.js";

export const listDocumentsService = async ({ userId }) => {
  try {
    const list = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { companyBranding: true },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const getDocumentService = async ({ id, userId }) => {
  try {
    const doc = await prisma.document.findFirst({
      where: { id, userId },
      include: { companyBranding: true },
    });
    if (!doc) throw new CustomError("Not found", 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const deleteDocumentService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket if needed
    await prisma.document.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const streamDocumentService = async ({
  userId,
  companyBrandingId,
  category,
  subCategory,
  inputsJson,
}) => {
  const prompt = getDocumentPrompt(inputsJson, subCategory);

  const parsedUserId = Number(userId);
  const parsedCompanyBrandingId = Number(companyBrandingId);

  if (isNaN(parsedUserId)) {
    throw new Error("Invalid userId: must be a number");
  }
  if (isNaN(parsedCompanyBrandingId)) {
    throw new Error("Invalid companyBrandingId: must be a number");
  }

  let companyBrandingIdToUse = parsedCompanyBrandingId;

  const companyBranding = await prisma.companyBranding.findUnique({
    where: { id: parsedCompanyBrandingId },
    select: { id: true },
  });

  if (!companyBranding) {
    const newCompanyBranding = await prisma.companyBranding.create({
      data: {
        name: "Default Company Name",
        documentControlNumber: "N/A",
        logo: "",
      },
    });
    companyBrandingIdToUse = newCompanyBranding.id;
  }

  let fullText = "";

  const createdDocument = await prisma.document.create({
    data: {
      userId: parsedUserId,
      companyBrandingId: companyBrandingIdToUse,
      category,
      subCategory,
      inputsJson,
      generatedContent: "",
    },
  });

  async function* stream() {
    yield* (async function* () {
      for await (const chunk of streamUsingGemini(prompt)) {
        fullText += chunk;
        yield chunk;
      }
    })();

    await prisma.document.update({
      where: { id: createdDocument.id },
      data: { generatedContent: fullText },
    });
  }
  return stream();
};

export const updateDocumentService = async ({ id, userId, updateData }) => {
  try {
    const existing = await prisma.document.findFirst({ where: { id, userId } });
    if (!existing) throw new CustomError("Not found", 404);
    const allowedFields = [
      "category",
      "subCategory",
      "inputsJson",
      "generatedContent",
      "gcpFileUrl",
      "companyBrandingId",
    ];
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );
    const updated = await prisma.document.update({
      where: { id },
      data: filteredUpdateData,
    });
    return { success: true, data: updated };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};
