import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        if (isMounted) setLoading(true);
        
        // Fetch concurrently
        const [prodData, catData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        
        if (isMounted) {
          setProducts(prodData);
          setCategories(catData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong while fetching products.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, categories, loading, error };
};
