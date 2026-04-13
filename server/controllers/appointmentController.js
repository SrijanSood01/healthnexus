import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

const appointmentPopulate = [
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

export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, status } = req.body;

    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "patientId, doctorId, date and time are required",
        data: null,
      });
    }

    const appointmentDate = new Date(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
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

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: appointmentDate,
      time,
      status,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate(appointmentPopulate);

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: populatedAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create appointment",
      data: null,
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate(appointmentPopulate)
      .sort({ date: 1, time: 1 });

    return res.json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointments",
      data: null,
    });
  }
};

export const getAppointmentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await Appointment.find({ patientId })
      .populate(appointmentPopulate)
      .sort({ date: 1, time: 1 });

    return res.json({
      success: true,
      message: "Patient appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch patient appointments",
      data: null,
    });
  }
};

export const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({ doctorId })
      .populate(appointmentPopulate)
      .sort({ date: 1, time: 1 });

    return res.json({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch doctor appointments",
      data: null,
    });
  }
};
