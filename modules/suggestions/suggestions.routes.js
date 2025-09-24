import express from "express";
import * as suggestionsController from "./suggestions.controller.js";
import { authenticate } from "../../middlewares/auth.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const router = express.Router();

const suggestionsRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    type: "rate_limit_exceeded",
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = req.user?.userId || "anonymous";
    const ip = ipKeyGenerator(req);
    return `${userId}:${ip}`;
  },
});

const requestSizeLimit = (req, res, next) => {
  const contentLength = req.get("content-length");
  if (contentLength && parseInt(contentLength) > 1024 * 1024) {
    return res.status(413).json({
      success: false,
      message: "Request too large. Maximum size is 1MB.",
      type: "request_too_large",
    });
  }
  next();
};

router.post(
  "/",
  authenticate,
  suggestionsRateLimit,
  requestSizeLimit,
  suggestionsController.generateSuggestions
);

router.get("/stats", authenticate, suggestionsController.getSuggestionStats);

router.get("/health", suggestionsController.healthCheck);

router.get("/options", suggestionsController.getOptions);

export default router;
