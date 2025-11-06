import Prescription from "../models/Prescription.js";
import User from "../models/User.js";

// ✅ Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, overallRemarks } = req.body;

    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can create prescriptions" });
    }

    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const newPrescription = new Prescription({
      doctor: req.user.id,
      patient: patientId,
      medicines,
      overallRemarks,
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription saved successfully" });
  } catch (err) {
    console.error("createPrescription error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get prescriptions for a specific doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const prescriptions = await Prescription.find({ doctor: req.user.id })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (err) {
    console.error("getDoctorPrescriptions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
