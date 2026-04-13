import express from "express";
import {
  createDoctor,
  getDoctorByUserId,
  getDoctors,
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/", createDoctor);
router.get("/", getDoctors);
router.get("/user/:userId", getDoctorByUserId);

export default router;
