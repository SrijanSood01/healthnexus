import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();


// ==========================
// Dashboard Stats
// ==========================
router.get("/stats", async (req, res) => {
  try {

    const users = await User.countDocuments();
    const doctors = await User.countDocuments({ role: "Doctor" });

    res.json({
      users,
      doctors,
      appointments: 78
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================
// Get All Users
// ==========================
router.get("/users", async (req, res) => {

  try {

    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// ==========================
// Add New User (Admin)
// ==========================
router.post("/add-user", async (req, res) => {

  try {

    console.log("Incoming body:", req.body);

    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role are required"
      });
    }

    // Count existing users in department
    const count = await User.countDocuments({ role });

    // Generate serial number
    const serial = String(count + 1).padStart(4, "0");

    // Department code
    const deptCode = role.substring(0, 3).toUpperCase();

    // Employee Number
    const empNo = deptCode + serial;

    // Auto Email
    const email = `${empNo.toLowerCase()}@healthnexus.in`;

    // Auto Password
    const password =
      name.split(" ")[0].toLowerCase() + "@" + empNo;

    console.log("Generated:", empNo, email, password);

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      name,
      role,
      email,
      empNo,
      password: hashedPassword,
      status: "Active"
    });

    const savedUser = await newUser.save();

    console.log("Saved user:", savedUser);

    res.json({
      message: "User Created Successfully",
      empNo,
      email,
      password // send original password to admin
    });

  } catch (error) {

    console.error("Error creating user:", error);

    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });

  }

});

// ==========================
// Update User
// ==========================
router.put("/update-user/:id", async (req, res) => {
  try {

    const { name, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, role },
      { new: true }
    );

    res.json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// Delete User
// ==========================
router.delete("/delete-user/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;