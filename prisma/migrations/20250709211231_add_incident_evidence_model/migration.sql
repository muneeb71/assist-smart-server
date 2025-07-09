-- CreateTable
CREATE TABLE "IncidentInvestigationEvidence" (
    "id" SERIAL NOT NULL,
    "incidentInvestigationId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentInvestigationEvidence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncidentInvestigationEvidence" ADD CONSTRAINT "IncidentInvestigationEvidence_incidentInvestigationId_fkey" FOREIGN KEY ("incidentInvestigationId") REFERENCES "IncidentInvestigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
