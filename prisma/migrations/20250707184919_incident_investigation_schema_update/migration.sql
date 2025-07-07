/*
  Warnings:

  - You are about to drop the column `incidentDetails` on the `IncidentInvestigation` table. All the data in the column will be lost.
  - You are about to drop the column `investigationDetails` on the `IncidentInvestigation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IncidentInvestigation" DROP COLUMN "incidentDetails",
DROP COLUMN "investigationDetails";
