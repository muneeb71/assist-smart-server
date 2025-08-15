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
    
    // Get the service response first
    const { stream, documentId } = await docsService.streamDocumentService({
      userId,
      companyBrandingId,
      category,
      subCategory,
      inputsJson,
    });
    
    // Set ALL headers BEFORE starting the stream
    res.setHeader("X-Document-ID", documentId.toString());
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    // Now start streaming
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    // Only send error response if headers haven't been sent yet
    if (!res.headersSent) {
      res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message });
    } else {
      // If headers already sent, just end the response
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
