-- DropForeignKey
ALTER TABLE "IncidentInvestigationDepartment" DROP CONSTRAINT "IncidentInvestigationDepartment_incidentInvestigationId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationEvidence" DROP CONSTRAINT "IncidentInvestigationEvidence_incidentInvestigationId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationImmediateCauseUnsafeAct" DROP CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeAct_incidentInves_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationImmediateCauseUnsafeCondition" DROP CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeCondition_inciden_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationParticipant" DROP CONSTRAINT "IncidentInvestigationParticipant_incidentInvestigationId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationRootCausePersonalFactor" DROP CONSTRAINT "IncidentInvestigationRootCausePersonalFactor_incidentInves_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationWitness" DROP CONSTRAINT "IncidentInvestigationWitness_incidentInvestigationId_fkey";

-- DropForeignKey
ALTER TABLE "MethodStatementSafetyMeasure" DROP CONSTRAINT "MethodStatementSafetyMeasure_methodStatementId_fkey";

-- DropForeignKey
ALTER TABLE "MethodStatementSafetyMeasure" DROP CONSTRAINT "MethodStatementSafetyMeasure_safetyMeasureId_fkey";

-- DropForeignKey
ALTER TABLE "MethodStatementStaffPerson" DROP CONSTRAINT "MethodStatementStaffPerson_methodStatementId_fkey";

-- DropForeignKey
ALTER TABLE "ResponsePlanEvacuationMap" DROP CONSTRAINT "ResponsePlanEvacuationMap_responsePlanId_fkey";

-- DropForeignKey
ALTER TABLE "ResponsePlanFireWarden" DROP CONSTRAINT "ResponsePlanFireWarden_responsePlanId_fkey";

-- DropForeignKey
ALTER TABLE "ResponsePlanFloorWarden" DROP CONSTRAINT "ResponsePlanFloorWarden_responsePlanId_fkey";

-- DropForeignKey
ALTER TABLE "SitePermissionParticipant" DROP CONSTRAINT "SitePermissionParticipant_sitePermissionId_fkey";

-- DropForeignKey
ALTER TABLE "ToolboxTalkTrainingMedia" DROP CONSTRAINT "ToolboxTalkTrainingMedia_toolboxTalkId_fkey";

-- AddForeignKey
ALTER TABLE "MethodStatementSafetyMeasure" ADD CONSTRAINT "MethodStatementSafetyMeasure_methodStatementId_fkey" FOREIGN KEY ("methodStatementId") REFERENCES "MethodStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodStatementSafetyMeasure" ADD CONSTRAINT "MethodStatementSafetyMeasure_safetyMeasureId_fkey" FOREIGN KEY ("safetyMeasureId") REFERENCES "SafetyMeasure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodStatementStaffPerson" ADD CONSTRAINT "MethodStatementStaffPerson_methodStatementId_fkey" FOREIGN KEY ("methodStatementId") REFERENCES "MethodStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlanEvacuationMap" ADD CONSTRAINT "ResponsePlanEvacuationMap_responsePlanId_fkey" FOREIGN KEY ("responsePlanId") REFERENCES "ResponsePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlanFireWarden" ADD CONSTRAINT "ResponsePlanFireWarden_responsePlanId_fkey" FOREIGN KEY ("responsePlanId") REFERENCES "ResponsePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsePlanFloorWarden" ADD CONSTRAINT "ResponsePlanFloorWarden_responsePlanId_fkey" FOREIGN KEY ("responsePlanId") REFERENCES "ResponsePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolboxTalkTrainingMedia" ADD CONSTRAINT "ToolboxTalkTrainingMedia_toolboxTalkId_fkey" FOREIGN KEY ("toolboxTalkId") REFERENCES "ToolboxTalk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePermissionParticipant" ADD CONSTRAINT "SitePermissionParticipant_sitePermissionId_fkey" FOREIGN KEY ("sitePermissionId") REFERENCES "SitePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationEvidence" ADD CONSTRAINT "IncidentInvestigationEvidence_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationParticipant" ADD CONSTRAINT "IncidentInvestigationParticipant_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationWitness" ADD CONSTRAINT "IncidentInvestigationWitness_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationDepartment" ADD CONSTRAINT "IncidentInvestigationDepartment_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationImmediateCauseUnsafeAct" ADD CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeAct_incidentInves_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationImmediateCauseUnsafeCondition" ADD CONSTRAINT "IncidentInvestigationImmediateCauseUnsafeCondition_inciden_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentInvestigationRootCausePersonalFactor" ADD CONSTRAINT "IncidentInvestigationRootCausePersonalFactor_incidentInves_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
