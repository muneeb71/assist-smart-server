import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import {
  createCompanyBrandingController,
  listCompanyBrandingsController,
  getCompanyBrandingController,
  updateCompanyBrandingController,
  deleteCompanyBrandingController,
} from "./companyBranding.controller.js";

const router = express.Router();

router.post("/", authenticate, createCompanyBrandingController);
router.get("/", authenticate, listCompanyBrandingsController);
router.get("/:id", authenticate, getCompanyBrandingController);
router.put("/:id", authenticate, updateCompanyBrandingController);
router.delete("/:id", authenticate, deleteCompanyBrandingController);

export default router;
