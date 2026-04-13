import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/report", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HEAL backend is running",
    data: null,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
