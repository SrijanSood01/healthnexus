import express from "express";
import { createPrescription, getDoctorPrescriptions } from "../controllers/prescriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createPrescription);
router.get("/doctor", protect, getDoctorPrescriptions);

export default router;
