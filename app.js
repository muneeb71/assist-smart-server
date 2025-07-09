import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { adminJs, adminUiRouter } from "./admin.js";
import { authRouter } from "./modules/auth/index.js";
import { riskAssessmentRouter } from "./modules/riskAssessment/index.js";
import { jobSafetyAnalysisRouter } from "./modules/jobSafetyAnalysis/index.js";
import { methodStatementRouter } from "./modules/methodStatement/index.js";
import { responsePlanRouter } from "./modules/responsePlan/index.js";
import { toolboxTalkRouter } from "./modules/toolboxTalk/index.js";
import { incidentReportRouter } from "./modules/incidentReport/index.js";
import { sitePermissionRouter } from "./modules/sitePermission/index.js";
import { incidentInvestigationRouter } from "./modules/incidentInvestigation/index.js";
import { legalRegisterRouter } from "./modules/legalRegister/index.js";
import { adminRouter } from "./modules/admin/index.js";

dotenv.config();
const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 8082;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/risk-assessments", riskAssessmentRouter);
app.use("/api/v1/job-safety-analysis", jobSafetyAnalysisRouter);
app.use("/api/v1/method-statements", methodStatementRouter);
app.use("/api/v1/response-plans", responsePlanRouter);
app.use("/api/v1/toolbox-talks", toolboxTalkRouter);
app.use("/api/v1/incident-reports", incidentReportRouter);
app.use("/api/v1/site-permissions", sitePermissionRouter);
app.use("/api/v1/incident-investigations", incidentInvestigationRouter);
app.use("/api/v1/legal-registers", legalRegisterRouter);
app.use("/admin", adminRouter);

app.use(adminJs.options.rootPath, adminUiRouter);

app.listen(port, () => {
  console.log("=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-==-");
  console.log(`Server running on port ${port}`);
  console.log("=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-==-");
});

app.use(function (req, res, next) {
  return res.status(404).json({ message: "Route not found" });
});
