import express from "express";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionsByPatientId,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/", createPrescription);
router.get("/", getPrescriptions);
router.get("/patient/:patientId", getPrescriptionsByPatientId);

export default router;
