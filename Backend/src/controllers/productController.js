import catchAsync from '../utils/catchAsync.js';
import * as productService from '../services/productService.js';

/**
 * GET /api/products
 * List products with optional pagination, search, and category filter.
 *
 * Query: ?page=1&limit=12&search=watch&category=fashion
 */
export const getProducts = catchAsync(async (req, res) => {
  const { page, limit, search, category } = req.query;
  const result = await productService.getAllProducts({ page, limit, search, category });

  res.json({
    success: true,
    data: result.products,
    pagination: result.pagination,
  });
});

/**
 * GET /api/products/categories
 * Get all unique product categories.
 */
export const getCategories = catchAsync(async (_req, res) => {
  const categories = await productService.getCategories();

  res.json({
    success: true,
    data: categories,
  });
});

/**
 * GET /api/products/:id
 * Get a single product by ID.
 */
export const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.json({
    success: true,
    data: product,
  });
});

/**
 * POST /api/products
 * Create a new product (admin only).
 */
export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: product,
  });
});

/**
 * PUT /api/products/:id
 * Update an existing product (admin only).
 */
export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.json({
    success: true,
    message: 'Product updated successfully.',
    data: product,
  });
});

/**
 * DELETE /api/products/:id
 * Delete a product (admin only).
 */
export const deleteProduct = catchAsync(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);

  res.json({
    success: true,
    message: result.message,
  });
});
