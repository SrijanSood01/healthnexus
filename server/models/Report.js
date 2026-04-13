import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  testName: {
    type: String,
    required: true,
    trim: true,
  },

  result: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
