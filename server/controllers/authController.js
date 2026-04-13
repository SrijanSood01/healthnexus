import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "name, email, password and role are required",
        data: null,
      });
    }

    if (role.toLowerCase() !== "patient") {
      return res.status(403).json({
        success: false,
        message: "You can only register as a patient. Other roles must be created by an admin.",
        data: null,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "patient",
    });

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: {
        id: newUser._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register user",
      data: null,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
        data: null,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to login",
      data: null,
    });
  }
};
