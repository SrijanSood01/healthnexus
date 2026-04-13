import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Report from "../models/Report.js";

const reportPopulate = [
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

export const createReport = async (req, res) => {
  try {
    const { patientId, doctorId, testName, result, status } = req.body;

    if (!patientId || !testName) {
      return res.status(400).json({
        success: false,
        message: "patientId and testName are required",
        data: null,
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }

    if (doctorId) {
      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
          data: null,
        });
      }
    }

    const report = await Report.create({
      patientId,
      doctorId: doctorId || undefined,
      testName,
      result,
      status,
    });

    const populatedReport = await Report.findById(report._id).populate(reportPopulate);

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: populatedReport,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create report",
      data: null,
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate(reportPopulate).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reports",
      data: null,
    });
  }
};

export const getReportsByPatientId = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.params.patientId })
      .populate(reportPopulate)
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Patient reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch patient reports",
      data: null,
    });
  }
};
