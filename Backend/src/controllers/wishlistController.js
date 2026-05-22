import catchAsync from '../utils/catchAsync.js';
import * as wishlistService from '../services/wishlistService.js';

/**
 * GET /api/wishlist
 * Get the authenticated user's wishlist.
 */
export const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.uid);

  res.json({
    success: true,
    data: wishlist,
  });
});

/**
 * GET /api/wishlist/all
 * Get all wishlists for debugging.
 */
export const getAllWishlists = catchAsync(async (req, res) => {
  const allWishlists = await wishlistService.getAllWishlists();

  res.json({
    success: true,
    data: allWishlists,
  });
});

/**
 * POST /api/wishlist
 * Toggle a product in the wishlist (add if absent, remove if present).
 */
export const toggleWishlist = catchAsync(async (req, res) => {
  const { productId, title, price, image, category } = req.body;
  const result = await wishlistService.toggleWishlistItem(req.user.uid, {
    productId,
    title,
    price,
    image,
    category,
  });

  res.json({
    success: true,
    message: `Product ${result.action} ${result.action === 'added' ? 'to' : 'from'} wishlist.`,
    data: result,
  });
});

/**
 * DELETE /api/wishlist/:productId
 * Remove a specific product from the wishlist.
 */
export const removeFromWishlist = catchAsync(async (req, res) => {
  const result = await wishlistService.removeFromWishlist(
    req.user.uid,
    req.params.productId
  );

  res.json({
    success: true,
    message: 'Product removed from wishlist.',
    data: result,
  });
});
