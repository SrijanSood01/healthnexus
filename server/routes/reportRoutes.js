import express from "express";
import {
  createReport,
  getReports,
  getReportsByPatientId,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", createReport);
router.get("/", getReports);
router.get("/patient/:patientId", getReportsByPatientId);

export default router;
