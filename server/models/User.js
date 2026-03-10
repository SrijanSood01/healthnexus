import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { type: String, required: true }, // department

  empNo: { type: String, unique: true },

  status: {
    type: String,
    enum: ["Active", "Suspended"],
    default: "Active"
  }
},
{ timestamps: true }
);

export default mongoose.model("User", userSchema);