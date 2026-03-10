import express from "express";
import User from "../models/User.js";

const router = express.Router();


// Dashboard stats
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


// Get all users
router.get("/users", async (req, res) => {

  try {

    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


// Add new user
router.post("/add-user", async (req, res) => {

  try {

    console.log("Incoming body:", req.body);

    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role are required"
      });
    }

    const count = await User.countDocuments({ role });

    const serial = String(count + 1).padStart(4, "0");

    const deptCode = role.substring(0,3).toUpperCase();

    const empNo = deptCode + serial;

    const email = `${empNo.toLowerCase()}@healthnexus.in`;

    const password =
      name.split(" ")[0].toLowerCase() + "@" + empNo;

    console.log("Generated:", empNo, email, password);

    const newUser = new User({
      name,
      role,
      email,
      empNo,
      password
    });

    const savedUser = await newUser.save();

    console.log("Saved user:", savedUser);

    res.json({
      message: "User Created Successfully",
      empNo,
      email,
      password
    });

  } catch (error) {

    console.error("Error creating user:", error);

    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });

  }

});

export default router;