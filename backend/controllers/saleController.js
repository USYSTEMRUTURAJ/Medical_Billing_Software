import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import Medicine from '../models/Medicine.js';

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerPhone,
    saleItems,
    paymentMethod,
    discount,
  } = req.body;

  if (saleItems && saleItems.length === 0) {
    res.status(400);
    throw new Error('No sale items');
  } else {
    let subtotal = 0;
    let gstTotal = 0;

    // Pass 1: Validation
    const medicinesToUpdate = [];
    for (const item of saleItems) {
      const medicine = await Medicine.findById(item.medicine);
      if (!medicine) {
        res.status(404);
        throw new Error(`Medicine not found: ${item.name}`);
      }

      if (medicine.stockQuantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}`);
      }
      
      medicinesToUpdate.push({ medicine, requestedQty: item.quantity, saleItem: item });
    }

    // Pass 2: Deduction and Calculation
    for (const data of medicinesToUpdate) {
      const { medicine, requestedQty, saleItem } = data;
      
      // Calculate Prices
      const itemPrice = medicine.sellingPrice;
      const gstAmount = (itemPrice * medicine.gstPercentage) / 100;
      
      const itemSubtotal = itemPrice * requestedQty;
      const itemGstTotal = gstAmount * requestedQty;

      subtotal += itemSubtotal;
      gstTotal += itemGstTotal;

      saleItem.price = itemPrice;
      saleItem.gstPercentage = medicine.gstPercentage;
      saleItem.totalItemPrice = itemSubtotal + itemGstTotal;
      
      // Deduct global stock
      medicine.stockQuantity -= requestedQty;
      
      // FEFO Batch Deduction
      if (medicine.batches && medicine.batches.length > 0) {
        // Sort batches by expiry date (ascending - oldest first)
        medicine.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        
        let remainingQtyToDeduct = requestedQty;
        for (let i = 0; i < medicine.batches.length; i++) {
          if (remainingQtyToDeduct <= 0) break;
          
          if (medicine.batches[i].quantity > 0) {
            if (medicine.batches[i].quantity >= remainingQtyToDeduct) {
              medicine.batches[i].quantity -= remainingQtyToDeduct;
              remainingQtyToDeduct = 0;
            } else {
              remainingQtyToDeduct -= medicine.batches[i].quantity;
              medicine.batches[i].quantity = 0;
            }
          }
        }
      }
      
      await medicine.save();
    }

    const totalPrice = (subtotal + gstTotal) - (discount || 0);

    const sale = new Sale({
      cashier: req.user._id,
      customerName: customerName || 'Walk-in Customer',
      customerPhone,
      saleItems,
      subtotal,
      gstTotal,
      discount: discount || 0,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'Credit' ? 'Pending' : 'Paid',
    });

    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  }
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find({}).populate('cashier', 'name').sort({ createdAt: -1 });
  res.json(sales);
});

// @desc    Get recent sales for dashboard
// @route   GET /api/sales/recent
// @access  Private
const getRecentSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find({}).sort({ createdAt: -1 }).limit(5);
  res.json(sales);
});

export { createSale, getSales, getRecentSales };
