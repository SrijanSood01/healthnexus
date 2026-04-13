import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";

const prescriptionPopulate = [
  {
    path: "patientId",
    populate: {
      path: "userId",
      select: "name email role",
    },
  },
  {
    path: "doctorId",
    populate: {
      path: "userId",
      select: "name email role",
    },
  },
];

export const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, medicines, notes } = req.body;

    if (!patientId || !doctorId || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patientId, doctorId and at least one medicine are required",
        data: null,
      });
    }

    const invalidMedicine = medicines.some(
      (medicine) => !medicine?.name || !medicine?.dosage || !medicine?.frequency,
    );

    if (invalidMedicine) {
      return res.status(400).json({
        success: false,
        message: "Each medicine must include name, dosage and frequency",
        data: null,
      });
    }

    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      Doctor.findById(doctorId),
    ]);

    if (!patient || !doctor) {
      return res.status(404).json({
        success: false,
        message: "Patient or doctor not found",
        data: null,
      });
    }

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      medicines,
      notes,
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate(prescriptionPopulate);

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: populatedPrescription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create prescription",
      data: null,
    });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate(prescriptionPopulate)
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch prescriptions",
      data: null,
    });
  }
};

export const getPrescriptionsByPatientId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .populate(prescriptionPopulate)
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Patient prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch patient prescriptions",
      data: null,
    });
  }
};
