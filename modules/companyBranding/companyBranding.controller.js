import { successResponse, errorResponse } from "../../lib/response.js";
import {
  createCompanyBrandingService,
  listCompanyBrandingsService,
  getCompanyBrandingService,
  updateCompanyBrandingService,
  deleteCompanyBrandingService,
} from "./companyBranding.service.js";

export const createCompanyBrandingController = async (req, res) => {
  try {
    const result = await createCompanyBrandingService(req.body);
    return successResponse(res, "Company branding created", result);
  } catch (err) {
    return errorResponse(
      res,
      "Failed to create company branding",
      err,
      err?.statusCode || 500
    );
  }
};

export const listCompanyBrandingsController = async (req, res) => {
  try {
    const result = await listCompanyBrandingsService();
    return successResponse(res, "Company brandings fetched", result);
  } catch (err) {
    return errorResponse(
      res,
      "Failed to fetch company brandings",
      err,
      err?.statusCode || 500
    );
  }
};

export const getCompanyBrandingController = async (req, res) => {
  try {
    const result = await getCompanyBrandingService(req.params.id);
    return successResponse(res, "Company branding fetched", result);
  } catch (err) {
    return errorResponse(
      res,
      "Failed to fetch company branding",
      err,
      err?.statusCode || 500
    );
  }
};

export const updateCompanyBrandingController = async (req, res) => {
  try {
    const result = await updateCompanyBrandingService(req.params.id, req.body);
    return successResponse(res, "Company branding updated", result);
  } catch (err) {
    return errorResponse(
      res,
      "Failed to update company branding",
      err,
      err?.statusCode || 500
    );
  }
};

export const deleteCompanyBrandingController = async (req, res) => {
  try {
    const result = await deleteCompanyBrandingService(req.params.id);
    return successResponse(res, "Company branding deleted", result);
  } catch (err) {
    return errorResponse(
      res,
      "Failed to delete company branding",
      err,
      err?.statusCode || 500
    );
  }
};
