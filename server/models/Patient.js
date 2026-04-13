import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  dob: {
    type: Date,
    required: true,
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },

  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
  }

}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
