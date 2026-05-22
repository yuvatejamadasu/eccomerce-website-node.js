import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Ticket, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItem from '../components/CartItem';
import { formatCurrency } from '../utils/helpers';

const Cart = () => {
  const { cartItems, subtotal, tax, shipping, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VIBE20') {
      const calculatedDiscount = subtotal * 0.20; // 20% discount
      setDiscount(calculatedDiscount);
      setPromoApplied(true);
      setPromoError('');
      showToast('Promo code "VIBE20" (20% Discount) applied successfully!', 'success');
    } else {
      setPromoError('Invalid coupon code! Try "VIBE20"');
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Shopping cart cleared successfully!', 'info');
  };

  // Adjust total price based on discount
  const finalTotalPrice = Math.max(0, totalPrice - discount);

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto space-y-6">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10 text-slate-400 dark:text-slate-600 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Your basket is feeling lonely...</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Looks like you haven't added any products to your shopping cart yet. Fill it with our trending collections!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">Shopping Cart</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Review your basket selection items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Clear Cart button */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <Link to="/products" className="text-xs font-bold text-primary-600 hover:underline">
                ← Continue Shopping
              </Link>
              <button
                onClick={handleClearCart}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear Shopping Basket
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Cost Summary Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Coupon Code section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary-600" /> Apply Coupon
            </h3>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code (e.g. VIBE20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={promoApplied}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:bg-emerald-600 disabled:text-white"
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </form>
            {promoApplied && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">
                Coupon "VIBE20" successfully applied! Enjoy 20% discount.
              </p>
            )}
            {promoError && (
              <p className="text-[10px] text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded-lg">
                {promoError}
              </p>
            )}
          </div>

          {/* Cost invoice card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Order Summary</h3>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {promoApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>VIBE20 (20% Off)</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between font-extrabold text-base text-slate-800 dark:text-slate-100">
                <span>Estimated Total</span>
                <span>{formatCurrency(finalTotalPrice)}</span>
              </div>
            </div>

            {/* Checkouts triggers */}
            <div className="space-y-4">
              <Link
                to="/checkout"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-primary-500/20 text-center"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium text-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Payments & Safe Delivery Guarantee
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
