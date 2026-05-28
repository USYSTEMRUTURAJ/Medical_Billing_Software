import mongoose from 'mongoose';

const medicineSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    manufacturer: { type: String },
    
    // Inventory and Pricing
    stockQuantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 10 },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    gstPercentage: { type: Number, required: true, default: 12 }, // 0, 5, 12, 18, 28
    
    // Batch and Expiry
    batches: [{
      batchNumber: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      quantity: { type: Number, required: true },
      rackLocation: { type: String }
    }],
    
    barcode: { type: String },
    requiresPrescription: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
