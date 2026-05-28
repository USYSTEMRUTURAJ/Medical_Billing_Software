import express from 'express';
import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/medicineController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMedicines)
  .post(protect, authorize('Admin', 'Manager'), createMedicine);

router.route('/:id')
  .put(protect, authorize('Admin', 'Manager'), updateMedicine)
  .delete(protect, authorize('Admin'), deleteMedicine);

export default router;
