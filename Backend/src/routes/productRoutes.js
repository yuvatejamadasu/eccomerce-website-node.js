import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import authenticate from '../middleware/auth.js';
import adminOnly from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// ─── Public Routes (no auth required) ─────────────────────────────

// GET /api/products — list with pagination, search, category filter
// GET /api/products?page=1&limit=12&search=watch&category=fashion
router.get('/', productController.getProducts);

// GET /api/products/categories — must be before /:id to avoid conflict
router.get('/categories', productController.getCategories);

// GET /api/products/:id
router.get('/:id', productController.getProduct);

// ─── Admin-Only Routes ─────────────────────────────────────────────

// POST /api/products
router.post(
  '/',
  authenticate,
  adminOnly,
  validate(['title', 'price', 'description', 'category']),
  productController.createProduct
);

// PUT /api/products/:id
router.put('/:id', authenticate, adminOnly, productController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', authenticate, adminOnly, productController.deleteProduct);

export default router;
