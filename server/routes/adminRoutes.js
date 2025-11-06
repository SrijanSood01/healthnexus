import express from "express";
import { createUser, getAllUsers } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can access these
router.post("/createUser", protect, createUser);
router.get("/users", protect, getAllUsers);

export default router;
