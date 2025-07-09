import { getModelByName } from "@adminjs/prisma";
import prisma from "../config/prisma.js";

export const getModelsToDisplay = () => {
  return [
    {
      resource: { model: getModelByName("User"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("Role"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("AccessLog"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("CompanyBranding"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("RiskAssessment"), client: prisma },
      options: {},
    },
    {
      resource: {
        model: getModelByName("IncidentInvestigation"),
        client: prisma,
      },
      options: {},
    },
    {
      resource: { model: getModelByName("AuditLog"), client: prisma },
      options: {},
    },
  ];
};
