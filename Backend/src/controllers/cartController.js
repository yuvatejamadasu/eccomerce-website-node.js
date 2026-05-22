import catchAsync from '../utils/catchAsync.js';
import * as cartService from '../services/cartService.js';

/**
 * GET /api/cart
 * Get the authenticated user's cart.
 */
export const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.uid);

  res.json({
    success: true,
    data: cart,
  });
});

/**
 * GET /api/cart/all
 * Get all carts for debugging.
 */
export const getAllCarts = catchAsync(async (req, res) => {
  const allCarts = await cartService.getAllCarts();

  res.json({
    success: true,
    data: allCarts,
  });
});

/**
 * POST /api/cart
 * Add an item to the cart (or increment quantity if it exists).
 */
export const addToCart = catchAsync(async (req, res) => {
  const { productId, title, price, image, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.uid, {
    productId,
    title,
    price,
    image,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: 'Item added to cart.',
    data: cart,
  });
});

/**
 * PUT /api/cart/:itemId
 * Update the quantity of a specific cart item.
 */
export const updateCartItem = catchAsync(async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(
    req.user.uid,
    req.params.itemId,
    quantity
  );

  res.json({
    success: true,
    message: 'Cart item updated.',
    data: cart,
  });
});

/**
 * DELETE /api/cart/:itemId
 * Remove a specific item from the cart.
 */
export const removeFromCart = catchAsync(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user.uid, req.params.itemId);

  res.json({
    success: true,
    message: 'Item removed from cart.',
    data: cart,
  });
});

/**
 * DELETE /api/cart
 * Clear the entire cart.
 */
export const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user.uid);

  res.json({
    success: true,
    message: 'Cart cleared.',
    data: cart,
  });
});
