import Medicine from "../models/Medicine.js";

export const addMedicine = async (req, res) => {
  try {
    const { name, stock, price } = req.body;

    if (!name || stock === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "name, stock and price are required",
        data: null,
      });
    }

    const medicine = await Medicine.create({
      name,
      stock,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add medicine",
      data: null,
    });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Medicines fetched successfully",
      data: medicines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medicines",
      data: null,
    });
  }
};

export const dispenseMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const quantity = Number(req.body.quantity);

    if (!medicineId || !Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid medicineId and quantity are required",
        data: null,
      });
    }

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
        data: null,
      });
    }

    if (Number(medicine.stock || 0) < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock for this medicine",
        data: null,
      });
    }

    medicine.stock = Number(medicine.stock || 0) - quantity;
    await medicine.save();

    return res.json({
      success: true,
      message: "Medicine dispensed successfully",
      data: medicine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to dispense medicine",
      data: null,
    });
  }
};
