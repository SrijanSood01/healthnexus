import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentsByDoctorId,
  getAppointmentsByPatientId,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/patient/:patientId", getAppointmentsByPatientId);
router.get("/doctor/:doctorId", getAppointmentsByDoctorId);

export default router;
