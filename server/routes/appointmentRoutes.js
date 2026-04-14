import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentsByDoctorId,
  getAppointmentsByPatientId,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/patient/:patientId", getAppointmentsByPatientId);
router.get("/doctor/:doctorId", getAppointmentsByDoctorId);
router.patch("/:appointmentId/status", updateAppointmentStatus);
router.post("/:appointmentId/status", updateAppointmentStatus);

export default router;
