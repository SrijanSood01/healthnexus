import express from "express";
import {
  createPatient,
  getPatientById,
  getPatientByUserId,
  getPatients,
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/", getPatients);
router.get("/user/:userId", getPatientByUserId);
router.get("/:id", getPatientById);

export default router;
