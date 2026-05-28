import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  res.json(settings);
});

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = new Setting({});
  }

  settings.shopName = req.body.shopName || settings.shopName;
  settings.address = req.body.address || settings.address;
  settings.phone = req.body.phone || settings.phone;
  settings.email = req.body.email || settings.email;
  settings.gstNumber = req.body.gstNumber || settings.gstNumber;

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

export { getSettings, updateSettings };
