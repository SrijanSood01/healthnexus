import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Database connection
connectDB();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("Server is running and MongoDB is connected!");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);