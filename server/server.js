import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database (MongoDB Atlas)
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/patients", patientRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 H.E.A.L Server is running and connected to MongoDB Atlas!");
});

const PORT = process.env.PORT || 5000;

// Start the server only after DB connection is successful
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
