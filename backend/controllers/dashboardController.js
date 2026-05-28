import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import Medicine from '../models/Medicine.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 1. Today's Sales and Total Invoices
  const todaysSalesData = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
        totalInvoices: { $sum: 1 },
      },
    },
  ]);

  const todaysSales = todaysSalesData.length > 0 ? todaysSalesData[0].totalSales : 0;
  const totalInvoices = todaysSalesData.length > 0 ? todaysSalesData[0].totalInvoices : 0;

  // 2. Low Stock Items
  const lowStockItems = await Medicine.countDocuments({
    $expr: {
      $lte: ['$stockQuantity', '$lowStockThreshold'],
    },
  });

  // 3. Expiring Soon (within 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringSoon = await Medicine.countDocuments({
    expiryDate: {
      $lte: thirtyDaysFromNow,
      $gt: new Date(),
    },
  });

  // 4. Revenue Overview (Last 7 days)
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const revenueData = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sevenDaysAgo,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Fill in missing days
  const chartData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateString = d.toISOString().split('T')[0];
    
    const existingData = revenueData.find((item) => item._id === dateString);
    chartData.push({
      date: dateString,
      revenue: existingData ? existingData.revenue : 0,
    });
  }

  // 5. Recent Alerts (Low stock items list)
  const lowStockAlerts = await Medicine.find({
    $expr: {
      $lte: ['$stockQuantity', '$lowStockThreshold'],
    },
  })
    .select('name stockQuantity lowStockThreshold')
    .limit(5);

  res.json({
    todaysSales,
    totalInvoices,
    lowStockItems,
    expiringSoon,
    chartData,
    recentAlerts: lowStockAlerts,
  });
});

export { getDashboardStats };
