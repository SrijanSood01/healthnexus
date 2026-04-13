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
