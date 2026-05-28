import asyncHandler from 'express-async-handler';
import Customer from '../models/Customer.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
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
            phone: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const customers = await Customer.find({ ...keyword }).sort({ createdAt: -1 });
  res.json(customers);
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const { name, phone, email, address } = req.body;

  const customerExists = await Customer.findOne({ phone });

  if (customerExists) {
    res.status(400);
    throw new Error('Customer with this phone number already exists');
  }

  const customer = new Customer({
    name,
    phone,
    email,
    address,
  });

  const createdCustomer = await customer.save();
  res.status(201).json(createdCustomer);
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    // If updating phone, check if it's already used by another customer
    if (req.body.phone && req.body.phone !== customer.phone) {
      const phoneExists = await Customer.findOne({ phone: req.body.phone });
      if (phoneExists) {
        res.status(400);
        throw new Error('Phone number is already associated with another customer');
      }
    }

    customer.name = req.body.name || customer.name;
    customer.phone = req.body.phone || customer.phone;
    customer.email = req.body.email || customer.email;
    customer.address = req.body.address || customer.address;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    await customer.deleteOne();
    res.json({ message: 'Customer removed' });
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

export { getCustomers, createCustomer, updateCustomer, deleteCustomer };
