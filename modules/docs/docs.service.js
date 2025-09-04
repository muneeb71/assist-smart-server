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
  let parsedInputs = inputsJson;
  if (typeof inputsJson === "string") {
    try {
      parsedInputs = JSON.parse(inputsJson);
    } catch (e) {
      throw new Error("Invalid inputsJson: must be a valid JSON string");
    }
  }

  if (subCategory === "Job Safety Analysis" && parsedInputs.knownHazards) {
    parsedInputs.knownHazards = Array.isArray(parsedInputs.knownHazards)
      ? parsedInputs.knownHazards.join(", ")
      : parsedInputs.knownHazards;
  }
  try {
    const prompt = getDocumentPrompt(JSON.stringify(parsedInputs), subCategory);

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
        inputsJson: JSON.stringify(parsedInputs),
        generatedContent: "",
        status: "open",
      },
    });
    console.log("createdDocument", createdDocument);
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

    return {
      stream: stream(),
      documentId: createdDocument.id,
    };
  } catch (err) {
    console.log(err);
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
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
      "status",
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

export const updateDocumentStatusService = async ({ id, userId, status }) => {
  try {
    const existing = await prisma.document.findFirst({ where: { id, userId } });
    if (!existing) throw new CustomError("Not found", 404);

    const validStatuses = ["closed"];
    if (!validStatuses.includes(status)) {
      throw new CustomError("Invalid status. Must be 'open' or 'closed'", 400);
    }

    const updated = await prisma.document.update({
      where: { id },
      data: { status },
      include: { companyBranding: true },
    });
    return { success: true, data: updated };
  } catch (err) {
    console.log(err);
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const createTrainingTrackerService = async ({
  userId,
  companyBrandingId,
  employeeName,
  employeeIdNumber,
  trainingType,
  trainingTopic,
  dateAndTime,
  certificateNumber,
  trainingHours,
  certificationName,
  certificationExpiryDate,
  certificationStatus,
  location,
  trainingEvidence,
  certificateFiles,
}) => {
  try {
    const parsedUserId = Number(userId);
    const parsedCompanyBrandingId = Number(companyBrandingId);

    if (isNaN(parsedUserId)) {
      throw new Error("Invalid userId: must be a number");
    }
    if (isNaN(parsedCompanyBrandingId)) {
      throw new Error("Invalid companyBrandingId: must be a number");
    }

    const companyBranding = await prisma.companyBranding.findUnique({
      where: { id: parsedCompanyBrandingId },
      select: { id: true },
    });

    if (!companyBranding) {
      throw new CustomError("Company branding not found", 404);
    }

    if (trainingType.toLowerCase() === "internal") {
      if (
        !trainingEvidence ||
        !Array.isArray(trainingEvidence) ||
        trainingEvidence.length === 0
      ) {
        throw new CustomError(
          "Training evidence is required for internal training",
          400
        );
      }
      if (trainingEvidence.length > 10) {
        throw new CustomError(
          "Maximum 10 training evidence files allowed",
          400
        );
      }

      certificateNumber = null;
      certificationName = null;
      certificationExpiryDate = null;
      certificationStatus = null;
      certificateFiles = [];
    } else {
      if (trainingEvidence && trainingEvidence.length > 0) {
        throw new CustomError(
          "Training evidence is not allowed for external training",
          400
        );
      }

      if (certificateFiles && Array.isArray(certificateFiles)) {
        if (certificateFiles.length > 5) {
          throw new CustomError("Maximum 5 certificate files allowed", 400);
        }
      }
    }

    const trainingRecord = await prisma.trainingTracker.create({
      data: {
        userId: parsedUserId,
        companyBrandingId: parsedCompanyBrandingId,
        employeeName,
        employeeIdNumber,
        trainingType,
        trainingTopic,
        dateAndTime: new Date(dateAndTime),
        certificateNumber,
        trainingHours,
        certificationName,
        certificationExpiryDate: certificationExpiryDate
          ? new Date(certificationExpiryDate)
          : null,
        certificationStatus,
        location,
        trainingEvidence: trainingEvidence || [],
        certificateFiles: certificateFiles || [],
      },
      include: {
        companyBranding: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: trainingRecord };
  } catch (err) {
    console.log(err);
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const listTrainingTrackersService = async () => {
  try {
    const trainingRecords = await prisma.trainingTracker.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        companyBranding: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: trainingRecords };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const getTrainingTrackerService = async ({ id, userId }) => {
  try {
    const trainingRecord = await prisma.trainingTracker.findFirst({
      where: { id, userId },
      include: {
        companyBranding: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!trainingRecord) {
      throw new CustomError("Training record not found", 404);
    }

    return { success: true, data: trainingRecord };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const updateTrainingTrackerService = async ({
  id,
  userId,
  updateData,
}) => {
  try {
    const existing = await prisma.trainingTracker.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new CustomError("Training record not found", 404);
    }

    const allowedFields = [
      "employeeName",
      "employeeIdNumber",
      "trainingType",
      "trainingTopic",
      "dateAndTime",
      "certificateNumber",
      "trainingHours",
      "companyBrandingId",
      "certificationName",
      "certificationExpiryDate",
      "certificationStatus",
      "location",
      "trainingEvidence",
      "certificateFiles",
    ];

    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    // Handle training type specific logic
    if (filteredUpdateData.trainingType) {
      if (filteredUpdateData.trainingType.toLowerCase() === "internal") {
        // For internal training, certificate details and files are not allowed
        if (
          filteredUpdateData.certificateNumber ||
          filteredUpdateData.certificationName ||
          filteredUpdateData.certificationExpiryDate ||
          filteredUpdateData.certificationStatus ||
          (filteredUpdateData.certificateFiles &&
            filteredUpdateData.certificateFiles.length > 0)
        ) {
          throw new CustomError(
            "Certificate details and files are not allowed for internal training",
            400
          );
        }

        // Training evidence is required for internal training
        if (
          !filteredUpdateData.trainingEvidence ||
          !Array.isArray(filteredUpdateData.trainingEvidence) ||
          filteredUpdateData.trainingEvidence.length === 0
        ) {
          throw new CustomError(
            "Training evidence is required for internal training",
            400
          );
        }
        if (filteredUpdateData.trainingEvidence.length > 10) {
          throw new CustomError(
            "Maximum 10 training evidence files allowed",
            400
          );
        }
      } else {
        // For external training, training evidence is not allowed
        if (
          filteredUpdateData.trainingEvidence &&
          filteredUpdateData.trainingEvidence.length > 0
        ) {
          throw new CustomError(
            "Training evidence is not allowed for external training",
            400
          );
        }

        // Validate certificate files if provided
        if (
          filteredUpdateData.certificateFiles &&
          Array.isArray(filteredUpdateData.certificateFiles)
        ) {
          if (filteredUpdateData.certificateFiles.length > 5) {
            throw new CustomError("Maximum 5 certificate files allowed", 400);
          }
        }
      }
    }

    // Convert dateAndTime to Date object if it exists
    if (filteredUpdateData.dateAndTime) {
      filteredUpdateData.dateAndTime = new Date(filteredUpdateData.dateAndTime);
    }

    // Convert certificationExpiryDate to Date object if it exists
    if (filteredUpdateData.certificationExpiryDate) {
      filteredUpdateData.certificationExpiryDate = new Date(
        filteredUpdateData.certificationExpiryDate
      );
    }

    const updated = await prisma.trainingTracker.update({
      where: { id },
      data: filteredUpdateData,
      include: {
        companyBranding: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: updated };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const deleteTrainingTrackerService = async ({ id, userId }) => {
  try {
    const existing = await prisma.trainingTracker.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new CustomError("Training record not found", 404);
    }

    await prisma.trainingTracker.delete({ where: { id } });

    return { success: true, message: "Training record deleted successfully" };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const createTrainingTrackerBulkService = async (
  data,
  companyBrandingId,
  userId
) => {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new CustomError("Data array is required and cannot be empty", 400);
    }

    if (data.length > 400) {
      throw new CustomError("Maximum 400 records allowed per bulk upload", 400);
    }

    const result = {
      successCount: 0,
      errorCount: 0,
      errors: [],
      successIds: [],
      totalProcessed: data.length,
    };

    for (let i = 0; i < data.length; i++) {
      const record = data[i];

      try {
        if (
          !record.employeeName ||
          !record.trainingType ||
          !record.trainingTopic ||
          !record.dateAndTime ||
          !record.trainingHours ||
          !record.location ||
          !record.trainingGivenBy
        ) {
          result.errors.push(`Row ${i + 1}: Missing required fields`);
          result.errorCount++;
          continue;
        }

        if (!["Internal", "External"].includes(record.trainingType)) {
          result.errors.push(
            `Row ${i + 1}: Invalid training type '${
              record.trainingType
            }'. Must be 'Internal' or 'External'`
          );
          result.errorCount++;
          continue;
        }

        if (record.trainingType === "External") {
          if (!record.certificateName || !record.certificationExpiryDate) {
            result.errors.push(
              `Row ${
                i + 1
              }: External training requires certificate name and expiry date`
            );
            result.errorCount++;
            continue;
          }
        }

        const trainingTracker = await prisma.trainingTracker.create({
          data: {
            companyBrandingId: companyBrandingId
              ? parseInt(companyBrandingId)
              : null,
            userId: userId,
            employeeName: record.employeeName,
            employeeIdNumber: record.employeeIdNumber || null,
            trainingType: record.trainingType,
            trainingTopic: record.trainingTopic,
            dateAndTime: new Date(record.dateAndTime),
            certificateNumber: record.certificateNumber || null,
            trainingHours: record.trainingHours,
            location: record.location,
            trainingGivenBy: record.trainingGivenBy,
            certificationName: record.certificateName || null,
            certificationExpiryDate: record.certificationExpiryDate
              ? new Date(record.certificationExpiryDate)
              : null,
            certificationStatus: record.certificationStatus || "Valid",
            certificateFiles: record.certificateFiles || [],
            trainingEvidence: record.trainingEvidence || [],
          },
        });

        result.successIds.push(trainingTracker.id);
        result.successCount++;
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);

        let errorMessage = `Row ${i + 1}: `;
        if (error.code === "P2002") {
          errorMessage += "Duplicate record found";
        } else {
          errorMessage += error.message || "Unknown error occurred";
        }

        result.errors.push(errorMessage);
        result.errorCount++;
      }
    }

    return result;
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};
