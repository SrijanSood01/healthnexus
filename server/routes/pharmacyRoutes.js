import express from "express";
import { addMedicine, dispenseMedicine, getMedicines } from "../controllers/pharmacyController.js";

const router = express.Router();

router.post("/", addMedicine);
router.get("/", getMedicines);
router.post("/:medicineId/dispense", dispenseMedicine);
router.patch("/:medicineId/dispense", dispenseMedicine);

export default router;
