import asyncHandler from 'express-async-handler';
import Supplier from '../models/Supplier.js';

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            name: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            companyName: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const suppliers = await Supplier.find({ ...keyword }).sort({ createdAt: -1 });
  res.json(suppliers);
});

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
const createSupplier = asyncHandler(async (req, res) => {
  const { name, companyName, phone, email, address } = req.body;

  const supplierExists = await Supplier.findOne({ phone });

  if (supplierExists) {
    res.status(400);
    throw new Error('Supplier with this phone number already exists');
  }

  const supplier = new Supplier({
    name,
    companyName,
    phone,
    email,
    address,
  });

  const createdSupplier = await supplier.save();
  res.status(201).json(createdSupplier);
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    if (req.body.phone && req.body.phone !== supplier.phone) {
      const phoneExists = await Supplier.findOne({ phone: req.body.phone });
      if (phoneExists) {
        res.status(400);
        throw new Error('Phone number is already associated with another supplier');
      }
    }

    supplier.name = req.body.name || supplier.name;
    supplier.companyName = req.body.companyName || supplier.companyName;
    supplier.phone = req.body.phone || supplier.phone;
    supplier.email = req.body.email || supplier.email;
    supplier.address = req.body.address || supplier.address;

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    await supplier.deleteOne();
    res.json({ message: 'Supplier removed' });
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});

export { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
