import { db } from '../config/firebase.js';
import { COLLECTIONS, PAGINATION } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import admin from 'firebase-admin';

const productsRef = db.collection(COLLECTIONS.PRODUCTS);

/**
 * Get all products with optional pagination, search, and category filtering.
 *
 * Query params: page, limit, search, category
 */
export const getAllProducts = async ({ page, limit, search, category }) => {
  const currentPage = Math.max(parseInt(page) || PAGINATION.DEFAULT_PAGE, 1);
  const pageSize = Math.min(
    Math.max(parseInt(limit) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );

  let query;

  if (category) {
    // Only use .where() — no .orderBy() to avoid needing a composite index.
    // We'll sort in-memory after fetching.
    query = productsRef.where('category', '==', category.toLowerCase());
  } else {
    // No filter: can safely use .orderBy() alone
    query = productsRef.orderBy('createdAt', 'desc');
  }

  // Fetch all matching docs (Firestore doesn't support LIKE / full-text natively)
  const snapshot = await query.get();

  let products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Sort in-memory by createdAt desc (needed when category filter is active)
  products.sort((a, b) => {
    const aTime = a.createdAt?._seconds ?? 0;
    const bTime = b.createdAt?._seconds ?? 0;
    return bTime - aTime;
  });

  // Client-side search filtering (title + description)
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  return {
    products: paginatedProducts,
    pagination: {
      currentPage,
      totalPages,
      totalProducts,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
};

/**
 * Get unique categories from all products.
 */
export const getCategories = async () => {
  const snapshot = await productsRef.get();
  const categorySet = new Set();
  snapshot.docs.forEach((doc) => {
    const cat = doc.data().category;
    if (cat) categorySet.add(cat);
  });
  return [...categorySet].sort();
};

/**
 * Get a single product by ID.
 */
export const getProductById = async (productId) => {
  const doc = await productsRef.doc(productId).get();
  if (!doc.exists) {
    throw new ApiError(404, `Product not found with ID: ${productId}`);
  }
  return { id: doc.id, ...doc.data() };
};

/**
 * Create a new product (admin only).
 */
export const createProduct = async (productData) => {
  const product = {
    title: productData.title,
    price: Number(productData.price),
    description: productData.description || '',
    category: productData.category?.toLowerCase() || 'uncategorized',
    image: productData.image || '',
    rating: {
      rate: Number(productData.rating?.rate) || 0,
      count: Number(productData.rating?.count) || 0,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await productsRef.add(product);
  return { id: docRef.id, ...product };
};

/**
 * Update an existing product (admin only).
 */
export const updateProduct = async (productId, updates) => {
  const doc = await productsRef.doc(productId).get();
  if (!doc.exists) {
    throw new ApiError(404, `Product not found with ID: ${productId}`);
  }

  const allowedFields = ['title', 'price', 'description', 'category', 'image', 'rating'];
  const sanitized = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      sanitized[field] = field === 'price' ? Number(updates[field]) : updates[field];
    }
  }

  if (sanitized.category) {
    sanitized.category = sanitized.category.toLowerCase();
  }

  sanitized.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  await productsRef.doc(productId).update(sanitized);

  const updatedDoc = await productsRef.doc(productId).get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

/**
 * Delete a product (admin only).
 */
export const deleteProduct = async (productId) => {
  const doc = await productsRef.doc(productId).get();
  if (!doc.exists) {
    throw new ApiError(404, `Product not found with ID: ${productId}`);
  }
  await productsRef.doc(productId).delete();
  return { id: productId, message: 'Product deleted successfully.' };
};
