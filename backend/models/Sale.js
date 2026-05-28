import mongoose from 'mongoose';

const saleItemSchema = mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Medicine',
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  gstPercentage: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true },
});

const saleSchema = mongoose.Schema(
  {
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    customerName: { type: String, default: 'Walk-in Customer' },
    customerPhone: { type: String },
    
    saleItems: [saleItemSchema],
    
    subtotal: { type: Number, required: true, default: 0.0 },
    gstTotal: { type: Number, required: true, default: 0.0 },
    discount: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Card', 'UPI', 'Credit'],
      default: 'Cash'
    },
    
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Paid', 'Pending'],
      default: 'Paid'
    },
    
    invoiceNumber: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

saleSchema.pre('save', async function () {
  if (this.isNew) {
    const lastSale = await mongoose.model('Sale').findOne().sort({ createdAt: -1 });
    let nextCount = 1;
    if (lastSale && lastSale.invoiceNumber) {
      const parts = lastSale.invoiceNumber.split('-');
      if (parts.length === 3 && parts[1] === String(new Date().getFullYear())) {
        nextCount = parseInt(parts[2], 10) + 1;
      }
    }
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${String(nextCount).padStart(5, '0')}`;
  }
});

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
