import express from "express";
import bcrypt from "bcryptjs";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

const router = express.Router();

const ROLE_CODE_MAP = {
  admin: "ADM",
  doctor: "DOC",
  nurse: "NUR",
  patient: "PNT",
  pharmacy: "PHA",
  pathology: "PTH",
};

const getNextUserCredentials = async (normalizedRole, name) => {
  const deptCode = ROLE_CODE_MAP[normalizedRole] || normalizedRole.substring(0, 3).toUpperCase();
  let serial = await User.countDocuments({ role: { $regex: new RegExp(`^${normalizedRole}$`, "i") } });

  while (true) {
    serial += 1;
    const serialValue = String(serial).padStart(4, "0");
    const empNo = `${deptCode}${serialValue}`;
    const email = `${empNo.toLowerCase()}@healthnexus.in`;

    const existingUser = await User.findOne({
      $or: [{ empNo }, { email }],
    }).select("_id");

    if (!existingUser) {
      return {
        empNo,
        email,
        password: `${name.split(" ")[0].toLowerCase()}@${empNo}`,
      };
    }
  }
};

router.get("/stats", async (req, res) => {
  try {
    const [users, doctors, appointments] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: { $regex: /^doctor$/i } }),
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
    const { empNo, email, password } = await getNextUserCredentials(normalizedRole, name);
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
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A generated user credential already exists. Please try again.",
        data: null,
      });
    }

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
