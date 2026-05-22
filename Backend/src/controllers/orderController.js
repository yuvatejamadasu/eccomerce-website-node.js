import catchAsync from '../utils/catchAsync.js';
import * as orderService from '../services/orderService.js';

/**
 * POST /api/orders
 * Place an order using the items currently in the user's cart.
 */
export const createOrder = catchAsync(async (req, res) => {
  const { shippingAddress } = req.body;
  const order = await orderService.createOrder(req.user.uid, shippingAddress);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    data: order,
  });
});

/**
 * GET /api/orders
 * Get all orders for the authenticated user.
 */
export const getOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.uid);

  res.json({
    success: true,
    data: orders,
  });
});

/**
 * GET /api/orders/:id
 * Get a single order by ID.
 */
export const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.user.uid, req.params.id);

  res.json({
    success: true,
    data: order,
  });
});
