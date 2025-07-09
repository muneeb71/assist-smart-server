/*
  Warnings:

  - You are about to drop the column `gcpFileUrl` on the `IncidentInvestigation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IncidentInvestigation" DROP COLUMN "gcpFileUrl",
ADD COLUMN     "generatedContent" TEXT;
