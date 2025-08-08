import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";
import { getIncidentInvestigationReportPrompt } from "../../lib/prompts.js";
import {
  generateUsingGemini,
  streamUsingGemini,
} from "../../lib/generateContent.js";

// Placeholder for GPT-4 and GCP integrations

export const createIncidentInvestigationService = async ({
  userId,
  companyBrandingId,
  incidentCategory,
  description,
  date,
  time,
  location,
  leadInvestigator,
  leadInvestigatorJobTitle,
  assistedBy,
  assistedByJobTitle,
  investigationDate,
  investigationCloseOutDate,
  building,
  eventDate,
  locationOfEvent,
  eventTime,
  personInvolved,
  personInvolvedJobTitle,
  personInvolvedAddress,
  personInvolvedJoiningDate,
  personInvolvedDaysAbsent,
  personInvolvedSupervisor,
  producedBy,
  producedByDate,
  approvedBy,
  approvedByDate,
  immediateCausesUnsafeActs = [],
  immediateCausesUnsafeConditions = [],
  rootCausesPersonalFactors = [],
}) => {
  try {
    const incidentInvestigation = await prisma.incidentInvestigation.create({
      data: {
        userId,
        companyBrandingId,
        incidentCategory,
        description,
        date: new Date(date),
        time,
        location,
        leadInvestigator,
        leadInvestigatorJobTitle,
        assistedBy,
        assistedByJobTitle,
        investigationDate,
        investigationCloseOutDate,
        building,
        eventDate,
        locationOfEvent,
        eventTime,
        personInvolved,
        personInvolvedJobTitle,
        personInvolvedAddress,
        personInvolvedJoiningDate,
        personInvolvedDaysAbsent,
        personInvolvedSupervisor,
        producedBy,
        producedByDate,
        approvedBy,
        approvedByDate,
        generatedContent: "",
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
        immediateCausesUnsafeActs: true,
        immediateCausesUnsafeConditions: true,
        rootCausesPersonalFactors: true,
        companyBranding: true,
      },
    });
    return { success: true, data: incidentInvestigation };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const listIncidentInvestigationsService = async ({ userId }) => {
  try {
    const list = await prisma.incidentInvestigation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
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

export const getIncidentInvestigationService = async ({ id, userId }) => {
  try {
    const doc = await prisma.incidentInvestigation.findFirst({
      where: { id, userId },
      include: {
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

export const deleteIncidentInvestigationService = async ({ id, userId }) => {
  try {
    // TODO: Delete file from GCP bucket
    await prisma.incidentInvestigation.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const streamIncidentInvestigationService = async ({
  userId,
  companyBrandingId,
  incidentCategory,
  description,
  date,
  time,
  location,
  leadInvestigator,
  leadInvestigatorJobTitle,
  assistedBy,
  assistedByJobTitle,
  investigationDate,
  investigationCloseOutDate,
  building,
  eventDate,
  locationOfEvent,
  eventTime,
  personInvolved,
  personInvolvedJobTitle,
  personInvolvedAddress,
  personInvolvedJoiningDate,
  personInvolvedDaysAbsent,
  personInvolvedSupervisor,
  producedBy,
  producedByDate,
  approvedBy,
  approvedByDate,
  immediateCausesUnsafeActs = [],
  immediateCausesUnsafeConditions = [],
  rootCausesPersonalFactors = [],
  evidenceUrls = [],
}) => {
  const prompt = getIncidentInvestigationReportPrompt({
    incidentCategory,
    description,
    immediateCausesUnsafeActs,
    immediateCausesUnsafeConditions,
    rootCausesPersonalFactors,
  });

  const parsedUserId = Number(userId);
  const parsedCompanyBrandingId = Number(companyBrandingId);

  if (isNaN(parsedUserId)) throw new Error("Invalid userId: must be a number");
  if (isNaN(parsedCompanyBrandingId))
    throw new Error("Invalid companyBrandingId: must be a number");

  // Ensure valid company branding
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

  // Create the investigation record early with empty generatedContent
  const createdIncident = await prisma.incidentInvestigation.create({
    data: {
      userId: parsedUserId,
      companyBrandingId: companyBrandingIdToUse,
      incidentCategory,
      description,
      date: new Date(date),
      time,
      location,
      leadInvestigator,
      leadInvestigatorJobTitle,
      assistedBy,
      assistedByJobTitle,
      investigationDate,
      investigationCloseOutDate,
      building,
      eventDate,
      locationOfEvent,
      eventTime,
      personInvolved,
      personInvolvedJobTitle,
      personInvolvedAddress,
      personInvolvedJoiningDate,
      personInvolvedDaysAbsent,
      personInvolvedSupervisor,
      producedBy,
      producedByDate,
      approvedBy,
      approvedByDate,
      generatedContent: "", // will be updated later
      immediateCausesUnsafeActs: {
        create: immediateCausesUnsafeActs.map((name) => ({ name })),
      },
      immediateCausesUnsafeConditions: {
        create: immediateCausesUnsafeConditions.map((name) => ({ name })),
      },
      rootCausesPersonalFactors: {
        create: rootCausesPersonalFactors.map((name) => ({ name })),
      },
      evidenceFiles: {
        create: evidenceUrls.map((url) => ({ url })),
      },
    },
  });

  async function* stream() {
    yield* (async function* () {
      for await (const chunk of streamUsingGemini(prompt)) {
        fullText += chunk;
        yield chunk;
      }
    })();

    // Save generatedContent after full stream
    await prisma.incidentInvestigation.update({
      where: { id: createdIncident.id },
      data: {
        generatedContent: fullText,
      },
    });
  }

  return stream();
};

export const updateIncidentInvestigationService = async ({
  id,
  userId,
  updateData,
}) => {
  try {
    // Ensure the document exists and belongs to the user
    const existing = await prisma.incidentInvestigation.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new CustomError("Not found", 404);
    const updated = await prisma.incidentInvestigation.update({
      where: { id },
      data: updateData,
    });
    return { success: true, data: updated };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};
