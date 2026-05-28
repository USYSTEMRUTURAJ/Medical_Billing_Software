import asyncHandler from 'express-async-handler';
import Medicine from '../models/Medicine.js';

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private
const getMedicines = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const limit = req.query.limit ? parseInt(req.query.limit) : 50;
  
  const medicines = await Medicine.find({ ...keyword }).sort({ createdAt: -1 }).limit(limit);
  res.json(medicines);
});

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private/Admin/Manager
const createMedicine = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    manufacturer,
    stockQuantity,
    lowStockThreshold,
    purchasePrice,
    sellingPrice,
    gstPercentage,
    batches,
    barcode,
    requiresPrescription,
    expiryDate,
  } = req.body;

  const medicine = new Medicine({
    name,
    category,
    description,
    manufacturer,
    stockQuantity,
    lowStockThreshold,
    purchasePrice,
    sellingPrice,
    gstPercentage,
    batches,
    barcode,
    requiresPrescription,
    expiryDate,
  });

  const createdMedicine = await medicine.save();
  res.status(201).json(createdMedicine);
});

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin/Manager
const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    medicine.name = req.body.name || medicine.name;
    medicine.category = req.body.category || medicine.category;
    medicine.description = req.body.description || medicine.description;
    medicine.manufacturer = req.body.manufacturer || medicine.manufacturer;
    medicine.stockQuantity = req.body.stockQuantity ?? medicine.stockQuantity;
    medicine.lowStockThreshold = req.body.lowStockThreshold ?? medicine.lowStockThreshold;
    medicine.purchasePrice = req.body.purchasePrice ?? medicine.purchasePrice;
    medicine.sellingPrice = req.body.sellingPrice ?? medicine.sellingPrice;
    medicine.gstPercentage = req.body.gstPercentage ?? medicine.gstPercentage;
    medicine.batches = req.body.batches || medicine.batches;
    medicine.barcode = req.body.barcode || medicine.barcode;
    medicine.requiresPrescription = req.body.requiresPrescription ?? medicine.requiresPrescription;
    medicine.expiryDate = req.body.expiryDate || medicine.expiryDate;

    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } else {
    res.status(404);
    throw new Error('Medicine not found');
  }
});

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    await medicine.deleteOne();
    res.json({ message: 'Medicine removed' });
  } else {
    res.status(404);
    throw new Error('Medicine not found');
  }
});

export { getMedicines, createMedicine, updateMedicine, deleteMedicine };
