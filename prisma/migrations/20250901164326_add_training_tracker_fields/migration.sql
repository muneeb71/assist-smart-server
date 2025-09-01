-- AlterTable
ALTER TABLE "TrainingTracker" ADD COLUMN     "certificationExpiryDate" TIMESTAMP(3),
ADD COLUMN     "certificationName" TEXT,
ADD COLUMN     "certificationStatus" TEXT,
ADD COLUMN     "location" TEXT;
