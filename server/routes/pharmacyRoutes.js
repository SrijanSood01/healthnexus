import express from "express";
import { addMedicine, getMedicines } from "../controllers/pharmacyController.js";

const router = express.Router();

router.post("/", addMedicine);
router.get("/", getMedicines);

export default router;
