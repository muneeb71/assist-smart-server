import prisma from "../../config/prisma.js";

import { generateToken } from "../../lib/token.js";
import { CustomError } from "../../lib/customError.js";
import { sendOtpToEmail } from "../../lib/mail.js";
import { uploadFileToGCP } from "../../lib/gcpUpload.js";
import jwt from "jsonwebtoken";

export const requestOtpService = async ({ email }) => {
  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const defaultRole = await prisma.role.findFirst({
        where: { name: "employee" },
      });
      user = await prisma.user.create({
        data: {
          email,
          fullName: email.split("@")[0],
          roleId: defaultRole ? defaultRole.id : undefined,
        },
        include: { role: true },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    if (user) {
      await prisma.otp.create({
        data: {
          code: otp,
          userId: user.id,
          expiresAt,
        },
      });
    }
    await sendOtpToEmail(email, otp);
    return { success: true };
  } catch (err) {
    console.error("PRISMA ERROR", err);
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};
export const getTokenProviderLoginService = async ({
  name,
  email,
  image,
  roleName,
  browser,
  city,
  country,
}) => {
  try {
    let role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      role = await prisma.role.create({
        data: { name: roleName },
      });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: name || "New User",
          email,
          profilePicture: image || "",
          roleId: role.id,
        },
      });
    }

    if (!user) throw new CustomError("User not found", 404);

    const token = generateToken({
      User: { id: user.id, role: { name: role.name } },
    });

    if (browser && city && country) {
      await createAccessLogService({ userId: user.id, browser, city, country });
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: role.name,
          profilePicture: user.profilePicture,
          mobileNumber: user.mobileNumber,
          gender: user.gender,
        },
        token,
      },
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const verifyOtpService = async ({
  email,
  otp,
  browser,
  city,
  country,
}) => {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    // If user doesn't exist, create it (default role: 'employee')
    if (!user) {
      const defaultRole = await prisma.role.findFirst({
        where: { name: "employee" },
      });
      user = await prisma.user.create({
        data: {
          email,
          fullName: email.split("@")[0],
          roleId: defaultRole ? defaultRole.id : undefined,
        },
        include: { role: true },
      });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        code: otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!otpRecord) throw new CustomError("Invalid or expired OTP", 400);
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });
    const token = generateToken({
      User: { id: user.id, role: { name: user.role.name } },
    });
    if (browser && city && country) {
      await createAccessLogService({ userId: user.id, browser, city, country });
    }
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role.name,
          profilePicture: user.profilePicture,
          mobileNumber: user.mobileNumber,
          gender: user.gender,
        },
        token,
      },
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const createAccessLogService = async ({
  userId,
  browser,
  city,
  country,
}) => {
  try {
    const existingLog = await prisma.accessLog.findFirst({
      where: {
        userId,
        browser,
        city,
        country,
      },
      orderBy: { createdAt: "desc" },
    });
    let log;
    if (existingLog) {
      log = await prisma.accessLog.update({
        where: { id: existingLog.id },
        data: { createdAt: new Date() },
      });
    } else {
      log = await prisma.accessLog.create({
        data: {
          userId,
          browser,
          city,
          country,
        },
      });
    }
    return { success: true, data: log };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const deleteAccessLogService = async ({ accessLogId }) => {
  try {
    const deletedLog = await prisma.accessLog.delete({
      where: { id: accessLogId },
    });
    return { success: true, data: deletedLog };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const getAccessLogsService = async ({ userId }) => {
  try {
    const logs = await prisma.accessLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: logs };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const updateProfileService = async ({
  userId,
  fullName,
  mobileNumber,
  gender,
  email,
  profilePicture,
}) => {
  try {
    let data = {
      fullName,
      mobileNumber,
      gender,
      email,
      profilePicture,
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return { success: true, data: user };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const deleteAccountService = async ({ userId }) => {
  try {
    const res = await prisma.user.delete({ where: { id: userId } });
  } catch (err) {
    console.error("❌ User delete failed:");
    console.error(err); // Logs full Prisma error object
  }
};

export const requestRoleAccessService = async ({ userId, requestedRole }) => {
  try {
    const role = await prisma.role.findUnique({
      where: { name: requestedRole },
    });
    if (!role) throw new CustomError("Requested role does not exist", 400);

    const request = await prisma.roleAccessRequest.create({
      data: {
        userId,
        requestedRoleId: role.id,
        status: "PENDING",
      },
    });
    return { success: true, data: request };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const getDocumentHistoryService = async ({ userId }) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const formatDoc = (doc) => ({
      id: doc.id,
      title: doc.subCategory || doc.category || doc.id,
      category: doc.category,
      subCategory: doc.subCategory,
      generatedOn: doc.createdAt,
      linkedUsers: [doc.user || "Unknown"],
      numberOfNewChanges: 0, 
    });

    const history = documents.map(formatDoc);

    return { success: true, data: history };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};

export const handleAppleCallbackService = async ({
  code,
  browser,
  city,
  country,
}) => {
  try {
    if (!code) {
      throw new CustomError("Missing authorization code", 400);
    }

    const tokenResponse = await fetch(
      `https://appleid.apple.com/auth/token?client_id=com.fleacttech.assistsmart.service&client_secret=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkdMSEJDRjUzUzcifQ.eyJpYXQiOjE3NTIyNzUzMTQsImV4cCI6MTc2NzgyNzMxNCwiYXVkIjoiaHR0cHM6Ly9hcHBsZWlkLmFwcGxlLmNvbSIsImlzcyI6IjZYU0RaOUFNTFAiLCJzdWIiOiJjb20uZmxlYWN0dGVjaC5hc3Npc3RzbWFydC5zZXJ2aWNlIn0.DSsVUxjn99C8hmL0GrQI5gQ0H_9VSMuLz_aXzYfZ41F0-DGEJhm195_5_mQMjJMc2z93tJB4eDIGk2sEn0RXUg&code=${code}&grant_type=authorization_code&redirect_uri=https://api.smarthse.ai/api/v1/auth/callback/apple`,
      {
        method: "POST",
      }
    );

    if (!tokenResponse.ok) {
      throw new CustomError("Failed to exchange code for token", 400);
    }

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      throw new CustomError("Invalid token response", 400);
    }

    const decoded = jwt.decode(idToken);
    const { email, sub } = decoded;

    if (!sub) {
      throw new CustomError("Invalid token", 400);
    }

    let user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      const defaultRole = await prisma.role.findFirst({
        where: { name: "employee" },
      });

      user = await prisma.user.create({
        data: {
          email: email || `apple_${sub}@example.com`,
          appleId: sub,
          fullName: email ? email.split("@")[0] : "Apple User",
          roleId: defaultRole ? defaultRole.id : undefined,
        },
        include: { role: true },
      });
    }

    const token = generateToken({
      User: { id: user.id, role: { name: user.role.name } },
    });

    if (browser && city && country) {
      await createAccessLogService({ userId: user.id, browser, city, country });
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role.name,
          profilePicture: user.profilePicture,
          mobileNumber: user.mobileNumber,
          gender: user.gender,
        },
        token,
      },
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Failed to authenticate with Apple",
      err.statusCode || 500
    );
  }
};
