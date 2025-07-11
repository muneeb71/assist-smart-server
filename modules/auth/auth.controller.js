import { successResponse, errorResponse } from "../../lib/response.js";
import {
  requestOtpService,
  verifyOtpService,
  getAccessLogsService,
  updateProfileService,
  deleteAccountService,
  requestRoleAccessService,
  getDocumentHistoryService,
  getTokenProviderLoginService,
  deleteAccessLogService,
  handleAppleCallbackService,
} from "./auth.service.js";

export const requestOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestOtpService({ email });
    return successResponse(res, "OTP sent to email", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to send OTP",
      err,
      err?.statusCode || 500
    );
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp, browser, city, country } = req.body;
    const result = await verifyOtpService({
      email,
      otp,
      browser,
      city,
      country,
    });
    return successResponse(res, "OTP verified, login successful", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "OTP verification failed",
      err,
      err?.statusCode || 500
    );
  }
};

export const getAccessLogsController = async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;
    if (!userId) return errorResponse(res, "User ID required", null, 400);
    const result = await getAccessLogsService({ userId: Number(userId) });
    return successResponse(res, "Access logs fetched", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to fetch access logs",
      err,
      err?.statusCode || 500
    );
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return errorResponse(res, "Unauthorized", null, 401);
    const { fullName, mobileNumber, gender, email, profilePicture } = req.body;
    const result = await updateProfileService({
      userId,
      fullName,
      mobileNumber,
      gender,
      email,
      profilePicture,
    });
    return successResponse(res, "Profile updated", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to update profile",
      err,
      err?.statusCode || 500
    );
  }
};

export const deleteAccountController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return errorResponse(res, "Unauthorized", null, 401);
    const result = await deleteAccountService({ userId });
    return successResponse(res, "Account deleted", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to delete account",
      err,
      err?.statusCode || 500
    );
  }
};

export const requestRoleAccessController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return errorResponse(res, "Unauthorized", null, 401);
    const { requestedRole } = req.body;
    if (!requestedRole)
      return errorResponse(res, "Requested role is required", null, 400);
    const result = await requestRoleAccessService({ userId, requestedRole });
    return successResponse(res, "Role access request submitted", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to request role access",
      err,
      err?.statusCode || 500
    );
  }
};

export const getDocumentHistoryController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return errorResponse(res, "Unauthorized", null, 401);
    const result = await getDocumentHistoryService({ userId });
    return successResponse(res, "Document history fetched", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to fetch document history",
      err,
      err?.statusCode || 500
    );
  }
};

export const providerLoginController = async (req, res) => {
  try {
    const { name, email, role, image, browser, city, country } = req.body;
    const result = await getTokenProviderLoginService({
      name,
      email,
      roleName: role,
      image,
      browser,
      city,
      country,
    });

    return successResponse(res, "Login successful", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to get token",
      err,
      err?.statusCode || 500
    );
  }
};

export const deleteAccessLogController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return errorResponse(res, "Unauthorized", null, 401);
    const accessLogId = req.params.id || req.body.accessLogId;
    if (!accessLogId) {
      return errorResponse(res, "Access Log ID required", null, 400);
    }
    const result = await deleteAccessLogService({
      accessLogId: Number(accessLogId),
    });
    return successResponse(res, "Access log deleted", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Failed to delete access log",
      err,
      err?.statusCode || 500
    );
  }
};

export const handleAppleCallbackController = async (req, res) => {
  try {
    const { code, browser, city, country } = req.body;
    const result = await handleAppleCallbackService({
      code,
      browser,
      city,
      country,
    });
    return successResponse(res, "Apple authentication successful", result);
  } catch (err) {
    console.log(err);
    return errorResponse(
      res,
      "Apple authentication failed",
      err,
      err?.statusCode || 500
    );
  }
};
