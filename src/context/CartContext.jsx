import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // Fetch cart from backend whenever the user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const data = await getCart();
          const items = (data.items || []).map(item => ({ ...item, id: item.productId }));
          setCartItems(items);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      } else {
        // Clear local cart if logged out
        setCartItems([]);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const data = await apiAddToCart({
        productId: String(product.id),
        title: product.title,
        price: product.price,
        image: product.image,
        quantity
      });
      setCartItems((data.items || []).map(item => ({ ...item, id: item.productId })));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const data = await apiRemoveFromCart(String(productId));
      setCartItems((data.items || []).map(item => ({ ...item, id: item.productId })));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user) return;
    if (newQuantity < 1) return;
    
    try {
      const data = await updateCartItem(String(productId), newQuantity);
      setCartItems((data.items || []).map(item => ({ ...item, id: item.productId })));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const data = await apiClearCart();
      setCartItems((data.items || []).map(item => ({ ...item, id: item.productId })));
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% sales tax
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 9.99; // Free shipping above $75
  const totalPrice = subtotal + tax + shipping;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        shipping,
        totalPrice,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
