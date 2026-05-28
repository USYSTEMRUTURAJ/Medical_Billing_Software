import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/authController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/register').post(protect, admin, registerUser);
router.route('/profile').get(protect, getUserProfile);

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
