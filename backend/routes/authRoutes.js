import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
} from '../controllers/authController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/register').post(protect, admin, registerUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
