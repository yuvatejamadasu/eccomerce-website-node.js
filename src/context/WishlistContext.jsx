import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getWishlist, toggleWishlistItem as apiToggleWishlistItem } from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  // Fetch wishlist from backend whenever the user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const data = await getWishlist();
          setWishlistItems((data.items || []).map(item => ({ ...item, id: item.productId })));
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        }
      } else {
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    try {
      const data = await apiToggleWishlistItem({
        productId: String(product.id),
        title: product.title,
        price: product.price,
        image: product.image
      });
      setWishlistItems((data.items || []).map(item => ({ ...item, id: item.productId })));
      return true;
    } catch (error) {
      console.error("Error toggling wishlist item:", error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => String(item.productId) === String(productId) || String(item.id) === String(productId));
  };

  const clearWishlist = () => {
    // There isn't an api method for clearWishlist in api.js currently, 
    // so we can just clear it locally or let the user handle it per-item
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
