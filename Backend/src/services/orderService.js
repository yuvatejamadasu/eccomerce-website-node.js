import { db } from '../config/firebase.js';
import { COLLECTIONS, ORDER_STATUSES } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import admin from 'firebase-admin';

const ordersRef = db.collection(COLLECTIONS.ORDERS);
const cartsRef = db.collection(COLLECTIONS.CARTS);

/**
 * Place an order from the user's cart.
 * Calculates totals and clears the cart after placing.
 */
export const createOrder = async (uid, shippingAddress) => {
  // Get cart items
  const cartDoc = await cartsRef.doc(uid).get();
  if (!cartDoc.exists || !cartDoc.data().items?.length) {
    throw new ApiError(400, 'Cannot place order. Cart is empty.');
  }

  const items = cartDoc.data().items;

  // Calculate totals (matching frontend logic)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% sales tax
  const shipping = subtotal > 75 ? 0 : 9.99; // Free shipping above $75
  const totalPrice = parseFloat((subtotal + tax + shipping).toFixed(2));

  const orderData = {
    userId: uid,
    items,
    shippingAddress,
    subtotal,
    tax,
    shipping,
    totalPrice,
    status: ORDER_STATUSES.PENDING,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Create order document
  const docRef = await ordersRef.add(orderData);

  // Clear the cart after successful order
  await cartsRef.doc(uid).set({
    items: [],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    orderId: docRef.id,
    ...orderData,
  };
};

/**
 * Get all orders for a specific user, sorted by most recent.
 */
export const getUserOrders = async (uid) => {
  const snapshot = await ordersRef
    .where('userId', '==', uid)
    .get();

  const orders = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Sort in-memory to avoid needing a Firestore composite index
  return orders.sort((a, b) => {
    const aTime = a.createdAt?._seconds ?? 0;
    const bTime = b.createdAt?._seconds ?? 0;
    return bTime - aTime;
  });
};

/**
 * Get a single order by ID (only if it belongs to the user).
 */
export const getOrderById = async (uid, orderId) => {
  const doc = await ordersRef.doc(orderId).get();

  if (!doc.exists) {
    throw new ApiError(404, `Order not found with ID: ${orderId}`);
  }

  const order = doc.data();
  if (order.userId !== uid) {
    throw new ApiError(403, 'Access denied. This order does not belong to you.');
  }

  return { id: doc.id, ...order };
};
