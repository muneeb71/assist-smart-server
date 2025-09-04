/*
  Warnings:

  - Added the required column `trainingGivenBy` to the `TrainingTracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add column with default value first
ALTER TABLE "TrainingTracker" ADD COLUMN     "trainingGivenBy" TEXT NOT NULL DEFAULT 'Unknown';

-- Update existing records with a more appropriate default value
UPDATE "TrainingTracker" SET "trainingGivenBy" = 'Training Manager' WHERE "trainingGivenBy" = 'Unknown';

-- Remove the default value constraint
ALTER TABLE "TrainingTracker" ALTER COLUMN "trainingGivenBy" DROP DEFAULT;
