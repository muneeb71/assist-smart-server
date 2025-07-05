import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";
import { getLegalRegisterTableDataPrompt } from "../../lib/prompts.js";
import {
  generateUsingGemini,
  streamUsingGemini,
} from "../../lib/generateContent.js";

// Placeholder for GPT-4 and GCP integrations

export const getLegalRegisterTableData = async ({
  userId,
  country,
  category,
  year,
}) => {
  try {
    const prompt = getLegalRegisterTableDataPrompt({
      country,
      category,
      year,
    });

    const parsedUserId = Number(userId);

    if (isNaN(parsedUserId)) {
      throw new Error("Invalid userId: must be a number");
    }

    const generatedContent = await generateUsingGemini(prompt);

    let cleanedContent = generatedContent.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    }
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedContent);
    } catch (e) {
      throw new CustomError("Failed to parse generated content as JSON", 500);
    }

    return { success: true, data: parsedContent };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const listLegalRegistersService = async ({ userId }) => {
  try {
    const list = await prisma.legalRegister.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const getLegalRegisterService = async ({ id, userId }) => {
  try {
    const doc = await prisma.legalRegister.findFirst({
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
    if (!doc) throw new CustomError("Not found", 404);
    return { success: true, data: doc };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const deleteLegalRegisterService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.legalRegister.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const streamLegalRegisterService = async ({
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
  participants = [],
  witnesses = [],
  departments = [],
  immediateCausesUnsafeActs = [],
  immediateCausesUnsafeConditions = [],
  rootCausesPersonalFactors = [],
}) => {
  const prompt = getLegalRegisterPrompt(
    incidentCategory,
    description,
    date,
    time,
    location,
    supervisor,
    reportedBy,
    incidentDetails,
    investigationDetails,
    participants,
    witnesses,
    departments,
    immediateCausesUnsafeActs,
    immediateCausesUnsafeConditions,
    rootCausesPersonalFactors
  );

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

  async function* stream() {
    yield* (async function* () {
      for await (const chunk of streamUsingGemini(prompt)) {
        fullText += chunk;
        yield chunk;
      }
    })();

    // Save to DB after streaming completes
    await prisma.legalRegister.create({
      data: {
        userId: parsedUserId,
        companyBrandingId: companyBrandingIdToUse,
        incidentCategory,
        description,
        date: new Date(date),
        time,
        location,
        supervisor,
        reportedBy,
        incidentDetails,
        investigationDetails,
        gcpFileUrl: null,
        // generatedContent: fullText,
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
    });
  }

  return stream();
};
