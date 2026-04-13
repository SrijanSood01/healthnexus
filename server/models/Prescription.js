import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String
    }
  ],

  notes: String

}, { timestamps: true });

export default mongoose.model("Prescription", prescriptionSchema);