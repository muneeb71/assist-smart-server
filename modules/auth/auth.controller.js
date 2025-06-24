import { successResponse, errorResponse } from "../../lib/response.js";
import {
  requestOtpService,
  verifyOtpService,
  getAccessLogsService,
  updateProfileService,
  deleteAccountService,
  requestRoleAccessService,
  getDocumentHistoryService,
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
    // Prefer userId from req.user (if authenticated), else from query
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
    const { fullName, mobileNumber, gender, profilePicture } = req.body;
    const result = await updateProfileService({
      userId,
      fullName,
      mobileNumber,
      gender,
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
    if (!requestedRole) return errorResponse(res, "Requested role is required", null, 400);
    const result = await requestRoleAccessService({ userId, requestedRole });
    return successResponse(res, "Role access request submitted", result);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to request role access", err, err?.statusCode || 500);
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
    return errorResponse(res, "Failed to fetch document history", err, err?.statusCode || 500);
  }
};
