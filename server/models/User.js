import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, lowercase: true, trim: true },
    empNo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
