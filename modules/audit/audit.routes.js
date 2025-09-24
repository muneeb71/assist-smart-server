import express from "express";
import * as auditController from "./audit.controller.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();

// Audit routes
router.get("/document/:id", authenticate, auditController.getDocumentAuditHistory);
router.get("/user", authenticate, auditController.getUserAuditHistory);
router.get("/all", authenticate, auditController.getAllAuditLogs);
router.get("/stats", authenticate, auditController.getAuditStats);

export default router;
