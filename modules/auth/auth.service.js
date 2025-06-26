import prisma from "../../config/prisma.js";

import { generateToken } from "../../lib/token.js";
import { CustomError } from "../../lib/customError.js";
import { sendOtpToEmail } from "../../lib/mail.js";
import { uploadFileToGCP } from "../../lib/gcpUpload.js";

export const requestOtpService = async ({ email }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new CustomError("User not found", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otp.create({
      data: {
        code: otp,
        userId: user.id,
        expiresAt,
      },
    });
    console.log(otp);

    await sendOtpToEmail(email, otp);
    return { success: true };
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
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) throw new CustomError("User not found", 404);

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
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
    const log = await prisma.accessLog.create({
      data: {
        userId,
        browser,
        city,
        country,
      },
    });
    return { success: true, data: log };
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
  profilePicture,
}) => {
  try {
    const gcpUrl = await uploadFileToGCP(
      profilePicture.buffer,
      profilePicture.originalname,
      "profile-pictures"
    );
    const user = await prisma.user.update({
      where: { id: userId },
      data: { fullName, mobileNumber, gender, profilePicture: gcpUrl },
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
    // Delete related data first if needed (e.g., otps, accessLogs)
    await prisma.otp.deleteMany({ where: { userId } });
    await prisma.accessLog.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    return { success: true };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
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
    // Collect all document types
    const [
      riskAssessments,
      jobSafetyAnalyses,
      methodStatements,
      responsePlans,
      toolboxTalks,
      incidentReports,
      sitePermissions,
      incidentInvestigations,
    ] = await Promise.all([
      prisma.riskAssessment.findMany({
        where: { userId },
        include: { user: true },
      }),
      prisma.jobSafetyAnalysis.findMany({
        where: { userId },
        include: { user: true },
      }),
      prisma.methodStatement.findMany({
        where: { userId },
        include: { user: true },
      }),
      prisma.responsePlan.findMany({
        where: { userId },
        include: { user: true },
      }),
      prisma.toolboxTalk.findMany({
        where: { userId },
        include: { user: true },
      }),
      prisma.incidentReport.findMany({
        where: { userId },
        include: { user: true },
      }),
      prisma.sitePermission.findMany({
        where: { userId },
        include: { user: true },
      }),
      prisma.incidentInvestigation.findMany({
        where: { userId },
        include: { user: true },
      }),
    ]);

    // Helper to format each doc
    const formatDoc = (doc, category, titleField = "id") => ({
      title: doc[titleField] || category,
      category,
      generatedOn: doc.createdAt,
      linkedUsers: [doc.user?.fullName || doc.user?.email || "Unknown"],
      numberOfNewChanges: 0, // Placeholder, implement change tracking if needed
    });

    const history = [
      ...riskAssessments.map((doc) =>
        formatDoc(doc, "Risk Assessment", "industry")
      ),
      ...jobSafetyAnalyses.map((doc) =>
        formatDoc(doc, "Job Safety Analysis", "activityType")
      ),
      ...methodStatements.map((doc) =>
        formatDoc(doc, "Method Statement", "activityName")
      ),
      ...responsePlans.map((doc) =>
        formatDoc(doc, "Response Plan", "emergencyType")
      ),
      ...toolboxTalks.map((doc) => formatDoc(doc, "Toolbox Talk", "topic")),
      ...incidentReports.map((doc) =>
        formatDoc(doc, "Incident Report", "incidentType")
      ),
      ...sitePermissions.map((doc) =>
        formatDoc(doc, "Site Permission", "activityType")
      ),
      ...incidentInvestigations.map((doc) =>
        formatDoc(doc, "Incident Investigation", "incidentCategory")
      ),
    ];

    // Sort by generatedOn desc
    history.sort((a, b) => b.generatedOn - a.generatedOn);
    return { success: true, data: history };
  } catch (err) {
    throw new CustomError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }
};
