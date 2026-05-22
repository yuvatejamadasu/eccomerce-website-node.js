import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    showToast(`Removed "${item.title.substring(0, 20)}..." from your cart.`, 'info');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0">
      
      {/* Thumbnail */}
      <Link to={`/product/${item.id}`} className="w-20 h-20 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
        />
      </Link>

      {/* Info details */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
        <Link to={`/product/${item.id}`} className="block">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate">
            {item.title}
          </h4>
        </Link>
        <span className="text-xs text-slate-400 mt-1 block">
          Unit Price: {formatCurrency(item.price)}
        </span>
      </div>

      {/* Quantity Controllers */}
      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shrink-0">
        <button
          onClick={handleDecrease}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-xs font-bold text-slate-700 dark:text-slate-200">
          {item.quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Total item aggregate */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={handleRemove}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:bg-slate-950 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 border border-slate-200/50 dark:border-slate-800 transition-colors"
          aria-label="Delete cart item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default CartItem;
