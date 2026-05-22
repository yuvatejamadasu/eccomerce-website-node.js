import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import authenticate from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// POST /api/orders — place an order from the user's cart
router.post(
  '/',
  validate(['shippingAddress']),
  orderController.createOrder
);

// GET /api/orders — get user's order history
router.get('/', orderController.getOrders);

// GET /api/orders/:id — get a single order
router.get('/:id', orderController.getOrder);

export default router;
