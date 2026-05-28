import express from 'express';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSuppliers)
  .post(protect, authorize('Admin', 'Manager'), createSupplier);

router.route('/:id')
  .put(protect, authorize('Admin', 'Manager'), updateSupplier)
  .delete(protect, authorize('Admin'), deleteSupplier);

export default router;
