import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      default: 'PharmaPro',
    },
    address: {
      type: String,
      default: '123 Health Street, Medical District',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    email: {
      type: String,
      default: 'contact@pharmapro.com',
    },
    gstNumber: {
      type: String,
      default: '27AAAAA0000A1Z5',
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
