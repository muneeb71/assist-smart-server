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
    const stream = await docsService.streamDocumentService({
      userId,
      companyBrandingId,
      category,
      subCategory,
      inputsJson,
    });
    res.setHeader("Content-Type", "text/plain");
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
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
