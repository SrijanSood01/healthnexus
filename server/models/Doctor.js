import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  specialization: {
    type: String,
    required: true,
    trim: true,
  },

  experience: {
    type: Number,
    required: true,
  },

  consultationFee: {
    type: Number
  }

}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
