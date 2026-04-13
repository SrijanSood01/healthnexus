import Doctor from "../models/Doctor.js";

const doctorPopulate = {
  path: "userId",
  select: "name email role empNo status",
};

export const createDoctor = async (req, res) => {
  try {
    const { userId, specialization, experience, consultationFee } = req.body;

    if (!userId || !specialization || experience === undefined || experience === null) {
      return res.status(400).json({
        success: false,
        message: "userId, specialization and experience are required",
        data: null,
      });
    }

    const existingDoctor = await Doctor.findOne({ userId }).populate(doctorPopulate);

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile already exists",
        data: existingDoctor,
      });
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      experience,
      consultationFee,
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate(doctorPopulate);

    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: populatedDoctor,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This user already has a doctor profile. Please login with another doctor account.",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create doctor profile",
      data: null,
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate(doctorPopulate).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch doctors",
      data: null,
    });
  }
};

export const getDoctorByUserId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId }).populate(doctorPopulate);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Doctor profile fetched successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch doctor profile",
      data: null,
    });
  }
};
