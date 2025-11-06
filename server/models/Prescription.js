import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: String,
  dosageM: String,
  dosageA: String,
  dosageN: String,
  type: String, // Tablet, Syrup, Injection
  quantity: String, // ml / nos
  remarks: String,
});

const prescriptionSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicines: [medicineSchema],
    overallRemarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
