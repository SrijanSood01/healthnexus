import Patient from "../models/Patient.js";

const patientPopulate = {
  path: "userId",
  select: "name email role empNo status",
};

export const createPatient = async (req, res) => {
  try {
    const { userId, dob, gender, phone, address, bloodGroup } = req.body;

    if (!userId || !dob || !gender || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "userId, dob, gender, phone and address are required",
        data: null,
      });
    }

    const existingPatient = await Patient.findOne({ userId }).populate(patientPopulate);

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient profile already exists",
        data: existingPatient,
      });
    }

    const parsedDob = new Date(dob);

    if (Number.isNaN(parsedDob.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date of birth",
        data: null,
      });
    }

    const patient = await Patient.create({
      userId,
      dob: parsedDob,
      gender,
      phone,
      address,
      bloodGroup,
    });

    const populatedPatient = await Patient.findById(patient._id).populate(patientPopulate);

    return res.status(201).json({
      success: true,
      message: "Patient profile created successfully",
      data: populatedPatient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create patient profile",
      data: null,
    });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate(patientPopulate).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch patients",
      data: null,
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(patientPopulate);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch patient",
      data: null,
    });
  }
};

export const getPatientByUserId = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.params.userId }).populate(patientPopulate);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Patient profile fetched successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch patient profile",
      data: null,
    });
  }
};
