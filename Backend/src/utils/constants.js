/**
 * Shared constants used across the application.
 */

export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  CARTS: 'carts',
  ORDERS: 'orders',
  WISHLISTS: 'wishlists',
};

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};
