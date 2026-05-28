import express from 'express';
import { createSale, getSales, getRecentSales } from '../controllers/saleController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createSale)
  .get(protect, getSales);

router.get('/recent', protect, getRecentSales);

export default router;
