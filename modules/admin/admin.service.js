import prisma from "../../config/prisma.js";

export const getAuditLogsService = async (filters = {}) => {
  const {
    documentType,
    userId,
    action,
    from,
    to,
    skip = 0,
    take = 50,
  } = filters;
  const where = {};
  if (documentType) where.documentType = documentType;
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = new Date(from);
  if (to) where.createdAt.lte = new Date(to);
  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: Number(skip),
    take: Number(take),
    include: { user: true },
  });
  return { success: true, data: logs };
};

export const createAuditLogService = async ({
  userId,
  action,
  documentType,
  documentId,
  details,
}) => {
  const log = await prisma.auditLog.create({
    data: { userId, action, documentType, documentId, details },
  });
  return { success: true, data: log };
};

export const getAdminAnalyticsService = async () => {
  // Example: count per document type
  const [
    riskAssessments,
    incidentReports,
    methodStatements,
    responsePlans,
    toolboxTalks,
    sitePermissions,
    incidentInvestigations,
    legalRegisters,
    users,
    logs,
  ] = await Promise.all([
    prisma.riskAssessment.count(),
    prisma.incidentReport.count(),
    prisma.methodStatement.count(),
    prisma.responsePlan.count(),
    prisma.toolboxTalk.count(),
    prisma.sitePermission.count(),
    prisma.incidentInvestigation.count(),
    prisma.legalRegister.count(),
    prisma.user.count(),
    prisma.auditLog.count(),
  ]);
  return {
    success: true,
    data: {
      documentCounts: {
        riskAssessments,
        incidentReports,
        methodStatements,
        responsePlans,
        toolboxTalks,
        sitePermissions,
        incidentInvestigations,
        legalRegisters,
      },
      userCount: users,
      auditLogCount: logs,
    },
  };
};

export const moderateDocumentService = async ({
  documentType,
  documentId,
  action,
  adminId,
}) => {
  // Dummy: just log the moderation action
  await createAuditLogService({
    userId: adminId,
    action,
    documentType,
    documentId,
    details: { moderation: true },
  });
  // Optionally update document status if you add a status field
  return { success: true };
};

export const getAllUsersService = async ({ skip = 0, take = 50 }) => {
  const users = await prisma.user.findMany({
    skip: Number(skip),
    take: Number(take),
    orderBy: { createdAt: "desc" },
    include: { role: true },
  });
  return { success: true, data: users };
};

export const getAllDocumentsService = async ({
  documentType,
  skip = 0,
  take = 50,
}) => {
  // Fetch all documents of a given type, or all types if not specified
  let data = [];
  if (!documentType || documentType === "RiskAssessment") {
    data = data.concat(
      await prisma.riskAssessment.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  if (!documentType || documentType === "IncidentReport") {
    data = data.concat(
      await prisma.incidentReport.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  if (!documentType || documentType === "MethodStatement") {
    data = data.concat(
      await prisma.methodStatement.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  if (!documentType || documentType === "ResponsePlan") {
    data = data.concat(
      await prisma.responsePlan.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  if (!documentType || documentType === "ToolboxTalk") {
    data = data.concat(
      await prisma.toolboxTalk.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  if (!documentType || documentType === "SitePermission") {
    data = data.concat(
      await prisma.sitePermission.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  if (!documentType || documentType === "IncidentInvestigation") {
    data = data.concat(
      await prisma.incidentInvestigation.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  if (!documentType || documentType === "LegalRegister") {
    data = data.concat(
      await prisma.legalRegister.findMany({
        skip: Number(skip),
        take: Number(take),
      })
    );
  }
  return { success: true, data };
};

export const getUserService = async (id) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) }, include: { role: true } });
  if (!user) throw new Error('User not found');
  return { success: true, data: user };
};

export const createUserService = async (data) => {
  const user = await prisma.user.create({ data });
  return { success: true, data: user };
};

export const updateUserService = async (id, data) => {
  const user = await prisma.user.update({ where: { id: Number(id) }, data });
  return { success: true, data: user };
};

export const deleteUserService = async (id) => {
  await prisma.user.delete({ where: { id: Number(id) } });
  return { success: true };
};

export const changeUserRoleService = async (id, roleId) => {
  const user = await prisma.user.update({ where: { id: Number(id) }, data: { roleId: Number(roleId) } });
  return { success: true, data: user };
};

export const getDocumentService = async (type, id) => {
  const model = getModelByType(type);
  const doc = await model.findUnique({ where: { id: Number(id) } });
  if (!doc) throw new Error('Document not found');
  return { success: true, data: doc };
};

export const updateDocumentService = async (type, id, data) => {
  const model = getModelByType(type);
  const doc = await model.update({ where: { id: Number(id) }, data });
  return { success: true, data: doc };
};

export const deleteDocumentService = async (type, id) => {
  const model = getModelByType(type);
  await model.delete({ where: { id: Number(id) } });
  return { success: true };
};

function getModelByType(type) {
  switch (type) {
    case 'RiskAssessment': return prisma.riskAssessment;
    case 'IncidentReport': return prisma.incidentReport;
    case 'MethodStatement': return prisma.methodStatement;
    case 'ResponsePlan': return prisma.responsePlan;
    case 'ToolboxTalk': return prisma.toolboxTalk;
    case 'SitePermission': return prisma.sitePermission;
    case 'IncidentInvestigation': return prisma.incidentInvestigation;
    case 'LegalRegister': return prisma.legalRegister;
    default: throw new Error('Unknown document type');
  }
}

export const getAuditLogService = async (id) => {
  const log = await prisma.auditLog.findUnique({ where: { id: Number(id) }, include: { user: true } });
  if (!log) throw new Error('Audit log not found');
  return { success: true, data: log };
};

export const listRolesService = async () => {
  const roles = await prisma.role.findMany();
  return { success: true, data: roles };
};

export const listRoleRequestsService = async () => {
  const requests = await prisma.roleAccessRequest.findMany({ include: { user: true, requestedRole: true } });
  return { success: true, data: requests };
};

export const approveRoleRequestService = async (id) => {
  const request = await prisma.roleAccessRequest.update({ where: { id: Number(id) }, data: { status: 'APPROVED' }, include: { user: true, requestedRole: true } });
  await prisma.user.update({ where: { id: request.userId }, data: { roleId: request.requestedRoleId } });
  return { success: true, data: request };
};

export const rejectRoleRequestService = async (id) => {
  const request = await prisma.roleAccessRequest.update({ where: { id: Number(id) }, data: { status: 'REJECTED' }, include: { user: true, requestedRole: true } });
  return { success: true, data: request };
};
