-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT,
    "gender" TEXT,
    "profilePicture" TEXT,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "browser" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAccessRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestedRoleId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyBranding" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "documentControlNumber" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyBranding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "industry" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "existingControlMeasures" TEXT NOT NULL,
    "responsibleDepartments" TEXT NOT NULL,
    "preparedBy" TEXT NOT NULL,
    "preparedByOccupation" TEXT NOT NULL,
    "reviewedBy" TEXT NOT NULL,
    "reviewedByOccupation" TEXT NOT NULL,
    "approvedBy" TEXT NOT NULL,
    "approvedByOccupation" TEXT NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSafetyAnalysis" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "activityType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "numberOfWorkers" INTEGER NOT NULL,
    "knownHazards" TEXT NOT NULL,
    "participantNames" TEXT NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSafetyAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MethodStatement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "activityName" TEXT NOT NULL,
    "toolsAndEquipment" TEXT NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "activityBrief" TEXT NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MethodStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyMeasure" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MethodStatementSafetyMeasure" (
    "id" SERIAL NOT NULL,
    "methodStatementId" INTEGER NOT NULL,
    "safetyMeasureId" INTEGER,
    "name" TEXT NOT NULL,

    CONSTRAINT "MethodStatementSafetyMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MethodStatementStaffPerson" (
    "id" SERIAL NOT NULL,
    "methodStatementId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,

    CONSTRAINT "MethodStatementStaffPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsePlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "emergencyType" TEXT NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponsePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsePlanEvacuationMap" (
    "id" SERIAL NOT NULL,
    "responsePlanId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "ResponsePlanEvacuationMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsePlanFireWarden" (
    "id" SERIAL NOT NULL,
    "responsePlanId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ResponsePlanFireWarden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsePlanFloorWarden" (
    "id" SERIAL NOT NULL,
    "responsePlanId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ResponsePlanFloorWarden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolboxTalk" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "keyPoints" TEXT NOT NULL,
    "numberOfParticipants" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolboxTalk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolboxTalkTrainingMedia" (
    "id" SERIAL NOT NULL,
    "toolboxTalkId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "ToolboxTalkTrainingMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "incidentType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SitePermission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "permitApplicantName" TEXT NOT NULL,
    "permitHolderName" TEXT NOT NULL,
    "supervisorName" TEXT NOT NULL,
    "descriptionOfWork" TEXT NOT NULL,
    "permitValidity" TEXT NOT NULL,
    "permitExtension" TEXT NOT NULL,
    "permitApproverName" TEXT NOT NULL,
    "permitClosureDate" TIMESTAMP(3) NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SitePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SitePermissionParticipant" (
    "id" SERIAL NOT NULL,
    "sitePermissionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SitePermissionParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInvestigation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "incidentCategory" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "supervisor" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "incidentDetails" TEXT NOT NULL,
    "investigationDetails" TEXT NOT NULL,
    "gcpFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentInvestigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInvestigationParticipant" (
    "id" SERIAL NOT NULL,
    "incidentInvestigationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentInvestigationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInvestigationWitness" (
    "id" SERIAL NOT NULL,
    "incidentInvestigationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentInvestigationWitness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInvestigationDepartment" (
    "id" SERIAL NOT NULL,
    "incidentInvestigationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentInvestigationDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInvestigationImmediateCauseUnsafeAct" (
    "id" SERIAL NOT NULL,
    "incidentInvestigationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeAct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInvestigationImmediateCauseUnsafeCondition" (
    "id" SERIAL NOT NULL,
    "incidentInvestigationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentInvestigationRootCausePersonalFactor" (
    "id" SERIAL NOT NULL,
    "incidentInvestigationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentInvestigationRootCausePersonalFactor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAccessRequest" ADD CONSTRAINT "RoleAccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAccessRequest" ADD CONSTRAINT "RoleAccessRequest_requestedRoleId_fkey" FOREIGN KEY ("requestedRoleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSafetyAnalysis" ADD CONSTRAINT "JobSafetyAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSafetyAnalysis" ADD CONSTRAINT "JobSafetyAnalysis_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodStatement" ADD CONSTRAINT "MethodStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodStatement" ADD CONSTRAINT "MethodStatement_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodStatementSafetyMeasure" ADD CONSTRAINT "MethodStatementSafetyMeasure_methodStatementId_fkey" FOREIGN KEY ("methodStatementId") REFERENCES "MethodStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodStatementSafetyMeasure" ADD CONSTRAINT "MethodStatementSafetyMeasure_safetyMeasureId_fkey" FOREIGN KEY ("safetyMeasureId") REFERENCES "SafetyMeasure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodStatementStaffPerson" ADD CONSTRAINT "MethodStatementStaffPerson_methodStatementId_fkey" FOREIGN KEY ("methodStatementId") REFERENCES "MethodStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlan" ADD CONSTRAINT "ResponsePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlan" ADD CONSTRAINT "ResponsePlan_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlanEvacuationMap" ADD CONSTRAINT "ResponsePlanEvacuationMap_responsePlanId_fkey" FOREIGN KEY ("responsePlanId") REFERENCES "ResponsePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlanFireWarden" ADD CONSTRAINT "ResponsePlanFireWarden_responsePlanId_fkey" FOREIGN KEY ("responsePlanId") REFERENCES "ResponsePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlanFloorWarden" ADD CONSTRAINT "ResponsePlanFloorWarden_responsePlanId_fkey" FOREIGN KEY ("responsePlanId") REFERENCES "ResponsePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolboxTalk" ADD CONSTRAINT "ToolboxTalk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolboxTalk" ADD CONSTRAINT "ToolboxTalk_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolboxTalkTrainingMedia" ADD CONSTRAINT "ToolboxTalkTrainingMedia_toolboxTalkId_fkey" FOREIGN KEY ("toolboxTalkId") REFERENCES "ToolboxTalk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePermission" ADD CONSTRAINT "SitePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePermission" ADD CONSTRAINT "SitePermission_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePermissionParticipant" ADD CONSTRAINT "SitePermissionParticipant_sitePermissionId_fkey" FOREIGN KEY ("sitePermissionId") REFERENCES "SitePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigation" ADD CONSTRAINT "IncidentInvestigation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigation" ADD CONSTRAINT "IncidentInvestigation_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationParticipant" ADD CONSTRAINT "IncidentInvestigationParticipant_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationWitness" ADD CONSTRAINT "IncidentInvestigationWitness_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationDepartment" ADD CONSTRAINT "IncidentInvestigationDepartment_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationImmediateCauseUnsafeAct" ADD CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeAct_incidentInves_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationImmediateCauseUnsafeCondition" ADD CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeCondition_inciden_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationRootCausePersonalFactor" ADD CONSTRAINT "IncidentInvestigationRootCausePersonalFactor_incidentInves_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
