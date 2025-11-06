import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ Create staff user (admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Ensure only admin can access this route
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Allow only specific staff roles
    if (!["doctor", "pharmacy", "pathology"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for admin creation" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: `${role} user created successfully` });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all users (for Admin dashboard)
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
