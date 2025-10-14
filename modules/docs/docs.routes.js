import express from "express";
import * as docsController from "./docs.controller.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();

// Training Tracker routes (MUST come before /:id routes to prevent conflicts)
router.post("/training-tracker", authenticate, docsController.createTrainingTracker);
router.post("/training-tracker/bulk", authenticate, docsController.createTrainingTrackerBulkController);
router.get("/training-tracker", authenticate, docsController.listTrainingTrackers);
router.get("/training-tracker/:id", authenticate, docsController.getTrainingTracker);
router.put("/training-tracker/:id", authenticate, docsController.updateTrainingTracker);
router.delete("/training-tracker/:id", authenticate, docsController.deleteTrainingTracker);
router.delete("/training-tracker", authenticate, docsController.deleteMultipleTrainingTrackers);

// Legacy route for backward compatibility
router.post("/training-tracker-legacy", authenticate, docsController.trainingTracker);

// Generic document routes (MUST come after specific routes)
router.get("/", authenticate, docsController.listDocuments);
router.get("/:id", authenticate, docsController.getDocument);
router.delete("/:id", authenticate, docsController.deleteDocument);
router.post("/stream", authenticate, docsController.streamDocument);
router.put("/:id", authenticate, docsController.updateDocument);
router.patch("/:id/status", authenticate, docsController.updateDocumentStatus);

export default router;
