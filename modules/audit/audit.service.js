import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";

/**
 * Audit Service
 * Handles all audit logging operations for document tracking
 */

export const logDocumentCreation = async ({
  userId,
  documentType,
  documentId,
  documentData,
  action = "CREATE",
}) => {
  try {
    const auditEntry = await prisma.auditLog.create({
      data: {
        userId,
        action,
        documentType,
        documentId,
        details: {
          operation: "Document Created",
          documentData: {
            category: documentData.category,
            subCategory: documentData.subCategory,
            status: documentData.status || "open",
            companyBrandingId: documentData.companyBrandingId,
            inputsJson: documentData.inputsJson ? "Present" : "Not provided",
            generatedContent: documentData.generatedContent
              ? "Generated"
              : "Not generated",
            gcpFileUrl: documentData.gcpFileUrl || null,
          },
          timestamp: new Date().toISOString(),
          changes: "Initial document creation",
        },
      },
    });

    console.log(
      `Audit Log Created: Document ${documentId} created by user ${userId}`
    );
    return auditEntry;
  } catch (error) {
    console.error("Error creating audit log for document creation:", error);
    // Don't throw error to avoid breaking the main operation
  }
};

export const logDocumentUpdate = async ({
  userId,
  documentType,
  documentId,
  oldData,
  newData,
  action = "UPDATE",
}) => {
  try {
    const changes = calculateChanges(oldData, newData);

    if (changes.length === 0) {
      console.log(`No changes detected for document ${documentId}`);
      return null;
    }

    const auditEntry = await prisma.auditLog.create({
      data: {
        userId,
        action,
        documentType,
        documentId,
        details: {
          operation: "Document Updated",
          changes,
          timestamp: new Date().toISOString(),
          oldValues: sanitizeDataForLogging(oldData),
          newValues: sanitizeDataForLogging(newData),
        },
      },
    });

    console.log(
      `Audit Log Created: Document ${documentId} updated by user ${userId} with ${changes.length} changes`
    );
    return auditEntry;
  } catch (error) {
    console.error("Error creating audit log for document update:", error);
    // Don't throw error to avoid breaking the main operation
  }
};

export const logDocumentDeletion = async ({
  userId,
  documentType,
  documentId,
  documentData,
  action = "DELETE",
}) => {
  try {
    const auditEntry = await prisma.auditLog.create({
      data: {
        userId,
        action,
        documentType,
        documentId,
        details: {
          operation: "Document Deleted",
          deletedDocumentData: sanitizeDataForLogging(documentData),
          timestamp: new Date().toISOString(),
          changes: "Document permanently deleted",
        },
      },
    });

    console.log(
      `Audit Log Created: Document ${documentId} deleted by user ${userId}`
    );
    return auditEntry;
  } catch (error) {
    console.error("Error creating audit log for document deletion:", error);
    // Don't throw error to avoid breaking the main operation
  }
};

export const logDocumentStatusChange = async ({
  userId,
  documentType,
  documentId,
  oldStatus,
  newStatus,
  action = "STATUS_CHANGE",
}) => {
  try {
    const auditEntry = await prisma.auditLog.create({
      data: {
        userId,
        action,
        documentType,
        documentId,
        details: {
          operation: "Document Status Changed",
          statusChange: {
            from: oldStatus,
            to: newStatus,
          },
          timestamp: new Date().toISOString(),
          changes: `Status changed from "${oldStatus}" to "${newStatus}"`,
        },
      },
    });

    console.log(
      `Audit Log Created: Document ${documentId} status changed by user ${userId} from ${oldStatus} to ${newStatus}`
    );
    return auditEntry;
  } catch (error) {
    console.error("Error creating audit log for status change:", error);
    // Don't throw error to avoid breaking the main operation
  }
};

export const getDocumentAuditHistory = async ({
  documentId,
  documentType,
  userId,
}) => {
  try {
    // Verify user has access to this document
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new CustomError("Document not found or access denied", 404);
    }

    const auditHistory = await prisma.auditLog.findMany({
      where: {
        documentId,
        documentType,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: auditHistory };
  } catch (error) {
    console.error("Error fetching document audit history:", error);
    throw new CustomError(
      error.message || "Internal Server Error",
      error.statusCode || 500
    );
  }
};

export const getUserAuditHistory = async ({ userId, limit = 50 }) => {
  try {
    const auditHistory = await prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: auditHistory };
  } catch (error) {
    console.error("Error fetching user audit history:", error);
    throw new CustomError(
      error.message || "Internal Server Error",
      error.statusCode || 500
    );
  }
};

export const getAllAuditLogs = async ({
  limit = 100,
  offset = 0,
  action,
  documentType,
  userId,
}) => {
  try {
    const whereClause = {};

    if (action) whereClause.action = action;
    if (documentType) whereClause.documentType = documentType;
    if (userId) whereClause.userId = userId;

    const auditLogs = await prisma.auditLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip: Number(offset),
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    const totalCount = await prisma.auditLog.count({
      where: whereClause,
    });

    return {
      success: true,
      data: auditLogs,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw new CustomError(
      error.message || "Internal Server Error",
      error.statusCode || 500
    );
  }
};

// Helper functions
const calculateChanges = (oldData, newData) => {
  const changes = [];
  const allowedFields = [
    "category",
    "subCategory",
    "inputsJson",
    "generatedContent",
    "gcpFileUrl",
    "companyBrandingId",
    "status",
  ];

  for (const field of allowedFields) {
    if (oldData[field] !== newData[field]) {
      changes.push({
        field,
        oldValue: sanitizeFieldForLogging(field, oldData[field]),
        newValue: sanitizeFieldForLogging(field, newData[field]),
        changeType: getChangeType(oldData[field], newData[field]),
      });
    }
  }

  return changes;
};

const getChangeType = (oldValue, newValue) => {
  if (oldValue === null || oldValue === undefined || oldValue === "") {
    return "ADD";
  }
  if (newValue === null || newValue === undefined || newValue === "") {
    return "REMOVE";
  }
  return "UPDATE";
};

const sanitizeDataForLogging = (data) => {
  if (!data) return data;

  const sanitized = { ...data };

  // Don't log full JSON content for privacy
  if (sanitized.inputsJson && typeof sanitized.inputsJson === "string") {
    try {
      const parsed = JSON.parse(sanitized.inputsJson);
      sanitized.inputsJson = `JSON with ${Object.keys(parsed).length} fields`;
    } catch {
      sanitized.inputsJson = "Invalid JSON";
    }
  }

  // Truncate long content
  if (sanitized.generatedContent && sanitized.generatedContent.length > 100) {
    sanitized.generatedContent =
      sanitized.generatedContent.substring(0, 100) + "...";
  }

  return sanitized;
};

const sanitizeFieldForLogging = (field, value) => {
  if (field === "inputsJson" && typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return `JSON with ${Object.keys(parsed).length} fields`;
    } catch {
      return "Invalid JSON";
    }
  }

  if (
    field === "generatedContent" &&
    typeof value === "string" &&
    value.length > 100
  ) {
    return value.substring(0, 100) + "...";
  }

  return value;
};
