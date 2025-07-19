import prisma from "../../config/prisma.js";
import { CustomError } from "../../lib/customError.js";

export const createCompanyBrandingService = async (data) => {
  try {
    console.log("DATA", data);
    if (!data.userId || isNaN(Number(data.userId))) {
      throw new CustomError("Invalid userId", 400);
    }
    const branding = await prisma.companyBranding.create({
      data: {
        userId: Number(data.userId),
        name: data.name,
        logo: data.logo,
        documentControlNumber: data.documentControlNumber,
      },
    });
    console.log("BRADING", branding);
    return { success: true, data: branding };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const listCompanyBrandingsService = async (userId) => {
  try {
    const where = userId ? { userId: Number(userId) } : {};
    const list = await prisma.companyBranding.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: list };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const getCompanyBrandingService = async (id) => {
  try {
    const branding = await prisma.companyBranding.findUnique({
      where: { id: Number(id) },
    });
    if (!branding) throw new CustomError("Not found", 404);
    return { success: true, data: branding };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const updateCompanyBrandingService = async (id, data) => {
  try {
    const branding = await prisma.companyBranding.update({
      where: { id: Number(id) },
      data,
    });
    return { success: true, data: branding };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const deleteCompanyBrandingService = async (id) => {
  try {
    await prisma.companyBranding.delete({ where: { id: Number(id) } });
    return { success: true };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};
