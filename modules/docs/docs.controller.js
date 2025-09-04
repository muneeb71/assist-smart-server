import * as docsService from "./docs.service.js";

export const listDocuments = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await docsService.listDocumentsService({ userId });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const result = await docsService.getDocumentService({
      id: Number(id),
      userId,
    });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const result = await docsService.deleteDocumentService({
      id: Number(id),
      userId,
    });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const streamDocument = async (req, res) => {
  try {
    const { userId } = req.user;
    const { companyBrandingId, category, subCategory, inputsJson } = req.body;

    console.log("companyBrandingId", companyBrandingId);
    console.log("category", category);
    console.log("subCategory", subCategory);
    console.log("inputsJson", inputsJson);

    const { stream, documentId } = await docsService.streamDocumentService({
      userId,
      companyBrandingId,
      category,
      subCategory,
      inputsJson,
    });

    res.setHeader("X-Document-ID", documentId);
    res.setHeader("Document-ID", documentId);
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message });
    } else {
      res.end();
    }
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const updateData = req.body;
    const result = await docsService.updateDocumentService({
      id: Number(id),
      userId,
      updateData,
    });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const updateDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await docsService.updateDocumentStatusService({
      id: Number(id),
      userId,
      status,
    });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const createTrainingTracker = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
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
    } = req.body;

    if (
      !employeeName ||
      !trainingType ||
      !trainingTopic ||
      !dateAndTime ||
      !trainingHours
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (trainingType.toLowerCase() === "internal") {
      if (
        !trainingEvidence ||
        !Array.isArray(trainingEvidence) ||
        trainingEvidence.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Training evidence is required for internal training",
        });
      }
      if (trainingEvidence.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Maximum 10 training evidence files allowed",
        });
      }
    } else {
      // For external training, validate certificate files if provided
      if (certificateFiles && Array.isArray(certificateFiles)) {
        if (certificateFiles.length > 5) {
          return res.status(400).json({
            success: false,
            message: "Maximum 5 certificate files allowed",
          });
        }
      }
    }

    const result = await docsService.createTrainingTrackerService({
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
    });

    res.status(201).json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const listTrainingTrackers = async (req, res) => {
  try {
    const result = await docsService.listTrainingTrackersService();
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const getTrainingTracker = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const result = await docsService.getTrainingTrackerService({
      id: Number(id),
      userId,
    });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const updateTrainingTracker = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const updateData = req.body;
    const result = await docsService.updateTrainingTrackerService({
      id: Number(id),
      userId,
      updateData,
    });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const deleteTrainingTracker = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const result = await docsService.deleteTrainingTrackerService({
      id: Number(id),
      userId,
    });
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const trainingTracker = async (req, res) => {
  try {
    const { userId } = req.user;
    const { trainingId } = req.body;

    // This method is kept for backward compatibility
    // You can implement specific training tracker logic here if needed
    res.json({
      success: true,
      message: "Training tracker endpoint reached",
      trainingId,
    });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

export const createTrainingTrackerBulkController = async (req, res) => {
  try {
    const { data, companyBrandingId } = req.body;
    const { userId } = req.user;

    const result = await docsService.createTrainingTrackerBulkService(
      data,
      companyBrandingId,
      userId
    );

    res.status(200).json({
      success: true,
      message: `Bulk upload completed. ${result.successCount} records created successfully.`,
      data: result,
    });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};
