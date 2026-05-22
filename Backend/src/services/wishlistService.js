import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';
import admin from 'firebase-admin';

const wishlistsRef = db.collection(COLLECTIONS.WISHLISTS);

/**
 * Get a user's wishlist.
 */
export const getWishlist = async (uid) => {
  const doc = await wishlistsRef.doc(uid).get();
  if (!doc.exists) {
    return { items: [] };
  }
  return doc.data();
};

/**
 * Get all wishlists (for debugging purposes).
 */
export const getAllWishlists = async () => {
  const snapshot = await wishlistsRef.get();
  const wishlists = {};
  snapshot.docs.forEach(doc => {
    wishlists[doc.id] = doc.data();
  });
  return wishlists;
};

/**
 * Toggle a product in the user's wishlist.
 * If the product exists, remove it. If not, add it.
 */
export const toggleWishlistItem = async (uid, product) => {
  const doc = await wishlistsRef.doc(uid).get();
  let items = doc.exists ? doc.data().items || [] : [];

  const existingIndex = items.findIndex(
    (item) => item.productId === product.productId
  );

  let action;
  if (existingIndex > -1) {
    // Remove from wishlist
    items.splice(existingIndex, 1);
    action = 'removed';
  } else {
    // Add to wishlist
    items.push({
      productId: product.productId,
      title: product.title,
      price: Number(product.price),
      image: product.image || '',
      category: product.category || '',
    });
    action = 'added';
  }

  await wishlistsRef.doc(uid).set(
    {
      items,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { items, action };
};

/**
 * Remove a specific product from the wishlist.
 */
export const removeFromWishlist = async (uid, productId) => {
  const doc = await wishlistsRef.doc(uid).get();
  if (!doc.exists) {
    return { items: [] };
  }

  let items = doc.data().items || [];
  items = items.filter((item) => item.productId !== productId);

  await wishlistsRef.doc(uid).update({
    items,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { items };
};
