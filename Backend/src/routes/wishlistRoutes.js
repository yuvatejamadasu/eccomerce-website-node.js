import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import authenticate from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// PUBLIC: GET /api/wishlist/all — view all wishlists from Firebase (no auth required)
router.get('/all', wishlistController.getAllWishlists);

// All routes below require authentication
router.use(authenticate);

// GET /api/wishlist — get user's own wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/wishlist — toggle a product (add/remove)
router.post(
  '/',
  validate(['productId', 'title', 'price']),
  wishlistController.toggleWishlist
);

// DELETE /api/wishlist/:productId — remove a specific product
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
