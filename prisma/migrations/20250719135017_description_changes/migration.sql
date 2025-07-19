/*
  Warnings:

  - You are about to drop the column `reportedBy` on the `IncidentInvestigation` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor` on the `IncidentInvestigation` table. All the data in the column will be lost.
  - Added the required column `approvedBy` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approvedByDate` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assistedBy` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assistedByJobTitle` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `building` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventDate` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventTime` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `investigationCloseOutDate` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `investigationDate` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadInvestigator` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadInvestigatorJobTitle` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationOfEvent` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInvolved` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInvolvedAddress` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInvolvedDaysAbsent` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInvolvedJobTitle` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInvolvedJoiningDate` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personInvolvedSupervisor` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `producedBy` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `producedByDate` to the `IncidentInvestigation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IncidentInvestigationDepartment" DROP CONSTRAINT "IncidentInvestigationDepartment_incidentInvestigationId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationParticipant" DROP CONSTRAINT "IncidentInvestigationParticipant_incidentInvestigationId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentInvestigationWitness" DROP CONSTRAINT "IncidentInvestigationWitness_incidentInvestigationId_fkey";

-- AlterTable
ALTER TABLE "CompanyBranding" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IncidentInvestigation" DROP COLUMN "reportedBy",
DROP COLUMN "supervisor",
ADD COLUMN     "approvedBy" TEXT NOT NULL,
ADD COLUMN     "approvedByDate" TEXT NOT NULL,
ADD COLUMN     "assistedBy" TEXT NOT NULL,
ADD COLUMN     "assistedByJobTitle" TEXT NOT NULL,
ADD COLUMN     "building" TEXT NOT NULL,
ADD COLUMN     "eventDate" TEXT NOT NULL,
ADD COLUMN     "eventTime" TEXT NOT NULL,
ADD COLUMN     "investigationCloseOutDate" TEXT NOT NULL,
ADD COLUMN     "investigationDate" TEXT NOT NULL,
ADD COLUMN     "leadInvestigator" TEXT NOT NULL,
ADD COLUMN     "leadInvestigatorJobTitle" TEXT NOT NULL,
ADD COLUMN     "locationOfEvent" TEXT NOT NULL,
ADD COLUMN     "personInvolved" TEXT NOT NULL,
ADD COLUMN     "personInvolvedAddress" TEXT NOT NULL,
ADD COLUMN     "personInvolvedDaysAbsent" TEXT NOT NULL,
ADD COLUMN     "personInvolvedJobTitle" TEXT NOT NULL,
ADD COLUMN     "personInvolvedJoiningDate" TEXT NOT NULL,
ADD COLUMN     "personInvolvedSupervisor" TEXT NOT NULL,
ADD COLUMN     "producedBy" TEXT NOT NULL,
ADD COLUMN     "producedByDate" TEXT NOT NULL;
