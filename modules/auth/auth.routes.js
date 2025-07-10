import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import {
  requestOtpController,
  verifyOtpController,
  getAccessLogsController,
  updateProfileController,
  deleteAccountController,
  requestRoleAccessController,
  getDocumentHistoryController,
  providerLoginController,
  deleteAccessLogController,
} from "./auth.controller.js";

const router = express.Router();

router.post("/request-otp", requestOtpController);
router.post("/provider-login", providerLoginController);
router.post("/verify-otp", verifyOtpController);
router.get("/access-logs", authenticate, getAccessLogsController);
router.put("/profile", authenticate, updateProfileController);
router.delete("/account", authenticate, deleteAccountController);
router.post("/request-role-access", authenticate, requestRoleAccessController);
router.get("/document-history", authenticate, getDocumentHistoryController);
router.delete("/access-log/:id", authenticate, deleteAccessLogController);

export default router;
