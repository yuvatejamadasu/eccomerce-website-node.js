import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import authenticate from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// PUBLIC: GET /api/cart/all — view all carts from Firebase (no auth required)
router.get('/all', cartController.getAllCarts);

// All routes below require authentication
router.use(authenticate);

// GET /api/cart — get user's cart
router.get('/', cartController.getCart);

// POST /api/cart — add item to cart
router.post(
  '/',
  validate(['productId', 'title', 'price']),
  cartController.addToCart
);

// PUT /api/cart/:itemId — update item quantity
router.put('/:itemId', validate(['quantity']), cartController.updateCartItem);

// DELETE /api/cart — clear entire cart (must be before /:itemId)
router.delete('/', cartController.clearCart);

// DELETE /api/cart/:itemId — remove specific item
router.delete('/:itemId', cartController.removeFromCart);

export default router;
