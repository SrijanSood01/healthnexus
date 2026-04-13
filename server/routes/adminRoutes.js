import express from "express";
import bcrypt from "bcryptjs";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const [users, doctors, appointments] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "doctor" }),
      Appointment.countDocuments(),
    ]);

    return res.json({
      success: true,
      message: "Admin stats fetched successfully",
      data: {
        users,
        doctors,
        appointments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin stats",
      data: null,
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
      data: null,
    });
  }
});

router.post("/add-user", async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required",
        data: null,
      });
    }

    const normalizedRole = role.toLowerCase();
    const count = await User.countDocuments({ role: normalizedRole });
    const serial = String(count + 1).padStart(4, "0");
    const deptCode = normalizedRole.substring(0, 3).toUpperCase();
    const empNo = `${deptCode}${serial}`;
    const email = `${empNo.toLowerCase()}@healthnexus.in`;
    const password = `${name.split(" ")[0].toLowerCase()}@${empNo}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      role: normalizedRole,
      email,
      empNo,
      password: hashedPassword,
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        empNo,
        email,
        password,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create user",
      data: null,
    });
  }
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required",
        data: null,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        role: role.toLowerCase(),
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update user",
      data: null,
    });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
      data: null,
    });
  }
});

export default router;
