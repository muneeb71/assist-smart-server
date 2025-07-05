-- CreateTable
CREATE TABLE "LegalRegister" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "companyBrandingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "LegalRegister_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LegalRegister" ADD CONSTRAINT "LegalRegister_companyBrandingId_fkey" FOREIGN KEY ("companyBrandingId") REFERENCES "CompanyBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalRegister" ADD CONSTRAINT "LegalRegister_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
