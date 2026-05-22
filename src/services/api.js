const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const BASE_URL = getBaseUrl();

/**
 * Fetch all products
 * @returns {Promise<Array>}
 */
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=100`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Fetch a single product by ID
 * @param {number|string} id 
 * @returns {Promise<Object>}
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product ${id}: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch all categories
 * @returns {Promise<Array<string>>}
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Fetch products by category
 * @param {string} category 
 * @returns {Promise<Array>}
 */
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${BASE_URL}/products?category=${encodeURIComponent(category)}&limit=100`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products for category ${category}: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching category ${category} products:`, error);
    throw error;
  }
};
import axios from 'axios';

// Base URL for the backend API (adjust if you run on a different host/port)
const API_BASE = getBaseUrl();

// Helper to get stored token (if any)
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Auth – login
 */
export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
  const { token, ...user } = response.data.data;
  if (token) {
    localStorage.setItem('authToken', token);
  }
  return { ...user, token };
};

/**
 * Auth – signup (creates Firebase user + profile)
 */
export const signup = async (name, email, password) => {
  const response = await axios.post(`${API_BASE}/auth/signup`, { name, email, password });
  const { token, ...user } = response.data.data;
  if (token) {
    localStorage.setItem('authToken', token);
  }
  return { ...user, token };
};

/**
 * Cart – get current user's cart
 */
export const getCart = async () => {
  const response = await axios.get(`${API_BASE}/cart`, { headers: getAuthHeader() });
  return response.data.data;
};

/**
 * Cart – add item
 */
export const addToCart = async (item) => {
  const response = await axios.post(`${API_BASE}/cart`, item, { headers: getAuthHeader() });
  return response.data.data;
};

/**
 * Cart – update item quantity
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await axios.put(`${API_BASE}/cart/${itemId}`, { quantity }, { headers: getAuthHeader() });
  return response.data.data;
};

/**
 * Cart – clear entire cart
 */
export const clearCart = async () => {
  const response = await axios.delete(`${API_BASE}/cart`, { headers: getAuthHeader() });
  return response.data.data;
};

/**
 * Cart – remove a single item
 */
export const removeFromCart = async (itemId) => {
  const response = await axios.delete(`${API_BASE}/cart/${itemId}`, { headers: getAuthHeader() });
  return response.data.data;
};

/**
 * Wishlist – fetch wishlist
 */
export const getWishlist = async () => {
  const response = await axios.get(`${API_BASE}/wishlist`, { headers: getAuthHeader() });
  return response.data.data;
};

/**
 * Wishlist – toggle item (add/remove)
 */
export const toggleWishlistItem = async (product) => {
  const response = await axios.post(`${API_BASE}/wishlist`, product, { headers: getAuthHeader() });
  return response.data.data;
};

/**
 * Wishlist – remove specific product
 */
export const removeFromWishlist = async (productId) => {
  const response = await axios.delete(`${API_BASE}/wishlist/${productId}`, { headers: getAuthHeader() });
  return response.data.data;
};

// End of file
