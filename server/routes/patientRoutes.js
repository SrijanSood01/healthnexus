import express from "express";
import User from "../models/User.js";
import Prescription from "../models/Prescription.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ 1. Get all patients (for doctors)
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const patients = await User.find({ role: "patient" }).select("_id name email");
    res.json(patients);
  } catch (err) {
    console.error("patientRoutes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 2. Get current patient dashboard data
router.get("/me", protect, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patient = await User.findById(req.user.id).select("-password");

    // Fetch prescriptions linked to this patient
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    // Dummy placeholder for now — appointments and billing can be integrated later
    const upcomingAppointments = [];
    const billing = { totalDue: 1200 };

    res.status(200).json({
      profile: patient,
      prescriptions,
      appointments: upcomingAppointments,
      billing,
    });
  } catch (err) {
    console.error("patient/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
