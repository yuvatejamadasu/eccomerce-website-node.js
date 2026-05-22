import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import admin from 'firebase-admin';

const cartsRef = db.collection(COLLECTIONS.CARTS);

/**
 * Get a user's cart.
 */
export const getCart = async (uid) => {
  const doc = await cartsRef.doc(uid).get();
  if (!doc.exists) {
    return { items: [] };
  }
  return doc.data();
};

/**
 * Get all carts (for debugging purposes).
 */
export const getAllCarts = async () => {
  const snapshot = await cartsRef.get();
  const carts = {};
  snapshot.docs.forEach(doc => {
    carts[doc.id] = doc.data();
  });
  return carts;
};

/**
 * Add or update an item in the cart.
 * If the product already exists, increment its quantity.
 */
export const addToCart = async (uid, { productId, title, price, image, quantity = 1 }) => {
  const cartDoc = await cartsRef.doc(uid).get();

  let items = [];
  if (cartDoc.exists) {
    items = cartDoc.data().items || [];
  }

  const existingIndex = items.findIndex((item) => item.productId === productId);

  if (existingIndex > -1) {
    // Update quantity
    items[existingIndex].quantity += quantity;
  } else {
    // Add new item
    items.push({
      productId,
      title,
      price: Number(price),
      image: image || '',
      quantity: Number(quantity),
    });
  }

  await cartsRef.doc(uid).set(
    {
      items,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { items };
};

/**
 * Update the quantity of a specific cart item.
 */
export const updateCartItem = async (uid, productId, quantity) => {
  const cartDoc = await cartsRef.doc(uid).get();
  if (!cartDoc.exists) {
    throw new ApiError(404, 'Cart not found.');
  }

  let items = cartDoc.data().items || [];
  const itemIndex = items.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) {
    throw new ApiError(404, 'Item not found in cart.');
  }

  if (quantity < 1) {
    // Remove item if quantity is less than 1
    items.splice(itemIndex, 1);
  } else {
    items[itemIndex].quantity = Number(quantity);
  }

  await cartsRef.doc(uid).update({
    items,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { items };
};

/**
 * Remove a specific item from the cart.
 */
export const removeFromCart = async (uid, productId) => {
  const cartDoc = await cartsRef.doc(uid).get();
  if (!cartDoc.exists) {
    throw new ApiError(404, 'Cart not found.');
  }

  let items = cartDoc.data().items || [];
  const filtered = items.filter((item) => item.productId !== productId);

  if (filtered.length === items.length) {
    throw new ApiError(404, 'Item not found in cart.');
  }

  await cartsRef.doc(uid).update({
    items: filtered,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { items: filtered };
};

/**
 * Clear entire cart.
 */
export const clearCart = async (uid) => {
  await cartsRef.doc(uid).set({
    items: [],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { items: [] };
};
