import * as auditService from "./audit.service.js";

export const getDocumentAuditHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const result = await auditService.getDocumentAuditHistory({
      documentId: Number(id),
      documentType: "Document",
      userId,
    });

    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const getUserAuditHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 50 } = req.query;

    const result = await auditService.getUserAuditHistory({
      userId: Number(userId),
      limit: Number(limit),
    });

    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const getAllAuditLogs = async (req, res) => {
  try {
    const { limit = 100, offset = 0, action, documentType, userId } = req.query;

    const result = await auditService.getAllAuditLogs({
      limit: Number(limit),
      offset: Number(offset),
      action,
      documentType,
      userId: userId ? Number(userId) : undefined,
    });

    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const getAuditStats = async (req, res) => {
  try {
    const { userId } = req.user;
    const { startDate, endDate } = req.query;

    // This would be implemented in the service
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        totalActions: 0,
        actionsByType: {},
        recentActivity: [],
      },
    });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};
