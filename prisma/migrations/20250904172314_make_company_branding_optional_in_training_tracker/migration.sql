-- DropForeignKey
ALTER TABLE "TrainingTracker" DROP CONSTRAINT "TrainingTracker_companyBrandingId_fkey";

-- AlterTable
ALTER TABLE "TrainingTracker" ALTER COLUMN "companyBrandingId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TrainingTracker" ADD CONSTRAINT "TrainingTracker_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE SET NULL ON UPDATE CASCADE;
