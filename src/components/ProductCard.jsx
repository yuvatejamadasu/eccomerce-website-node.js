import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const { id, title, price, image, rating, category } = product;
  const isSaved = isInWishlist(id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    showToast(`Added "${title.substring(0, 25)}..." to your cart!`, 'success');
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    const success = await toggleWishlist(product);
    if (success) {
      if (!isSaved) {
        showToast('Saved to your wishlist!', 'success');
      } else {
        showToast('Removed from your wishlist.', 'info');
      }
    } else {
      showToast('Failed to update wishlist.', 'error');
    }
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Wishlist Toggle Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute right-3 top-3 z-10 p-2 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-full shadow-md text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'}`} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${id}`} className="relative block overflow-hidden aspect-square p-6 bg-slate-50 dark:bg-slate-950/40">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Product Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category Label */}
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {category}
          </span>
          {/* Title */}
          <Link to={`/product/${id}`} className="block">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 h-10">
              {title}
            </h3>
          </Link>
          
          {/* Star Rating Info */}
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {rating?.rate || '4.0'}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ({rating?.count || '120'})
            </span>
          </div>
        </div>

        {/* Pricing aggregates & Actions Row */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Price</span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              {formatCurrency(price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary-500/20"
            title="Quick add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
