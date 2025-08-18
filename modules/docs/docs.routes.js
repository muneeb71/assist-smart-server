import express from "express";
import * as docsController from "./docs.controller.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, docsController.listDocuments);
router.get("/:id", authenticate, docsController.getDocument);
router.delete("/:id", authenticate, docsController.deleteDocument);
router.post("/stream", authenticate, docsController.streamDocument);
router.put("/:id", authenticate, docsController.updateDocument);
router.patch("/:id/status", authenticate, docsController.updateDocumentStatus);

export default router;
