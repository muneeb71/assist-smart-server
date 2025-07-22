import express from "express";
import * as docsController from "./docs.controller.js";

const router = express.Router();

router.get("/", docsController.listDocuments);
router.get("/:id", docsController.getDocument);
router.delete("/:id", docsController.deleteDocument);
router.post("/stream", docsController.streamDocument);
router.put("/:id", docsController.updateDocument);

export default router;
