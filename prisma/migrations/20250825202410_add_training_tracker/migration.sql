-- CreateTable
CREATE TABLE "TrainingTracker" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeIdNumber" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "trainingTopic" TEXT NOT NULL,
    "dateAndTime" TIMESTAMP(3) NOT NULL,
    "certificateNumber" TEXT,
    "trainingHours" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingTracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingTracker" ADD CONSTRAINT "TrainingTracker_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingTracker" ADD CONSTRAINT "TrainingTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
