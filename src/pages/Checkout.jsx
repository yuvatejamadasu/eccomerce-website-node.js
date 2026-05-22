import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, ShoppingBag, ArrowRight, Award, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, validateEmail } from '../utils/helpers';
import Loader from '../components/Loader';

const Checkout = () => {
  const { cartItems, subtotal, tax, shipping, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  // Step state: 'shipping' -> 'processing' -> 'success'
  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Shipping Form States
  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    // Payment Card States
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = 'Valid Email is required';
    if (!formData.address.trim()) errors.address = 'Street Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim() || formData.zipCode.length < 5) errors.zipCode = 'ZIP Code must be at least 5 digits';
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = 'Phone must be at least 10 digits';
    
    // Credit card check
    if (!formData.cardName.trim()) errors.cardName = 'Cardholder name is required';
    if (!formData.cardNumber.trim() || formData.cardNumber.length < 16) errors.cardNumber = 'Enter a valid 16-digit card number';
    if (!formData.cardExpiry.trim() || !formData.cardExpiry.includes('/')) errors.cardExpiry = 'Use MM/YY format';
    if (!formData.cardCvv.trim() || formData.cardCvv.length < 3) errors.cardCvv = 'CVV must be 3 digits';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct form validation errors before proceeding!', 'warning');
      return;
    }

    setLoading(true);
    // Simulate gateway delay
    setTimeout(() => {
      setLoading(false);
      const generatedId = `VIBE-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setStep('success');
      showToast('Order placed successfully! Confetti incoming!', 'success');
      
      // Trigger canvas-confetti blast
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Clear basket items
      clearCart();
    }, 2000);
  };

  if (loading) {
    return <Loader fullPage message="Connecting to secure gateway. Processing transaction..." />;
  }

  // Success view
  if (step === 'success') {
    return (
      <div className="py-16 text-center max-w-lg mx-auto space-y-8 animate-slide-in">
        <div className="relative w-28 h-28 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
          <Award className="w-12 h-12 text-emerald-500 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-lg -z-10" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Order Placed!</h1>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            Thank you for shopping with ShopVibe. Your order has been registered and is being prepared for express delivery!
          </p>
        </div>

        {/* Order details panel */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm text-left divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-400">Transaction ID</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">{orderId}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-400">Delivery Recipient</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{formData.fullName}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-slate-400">Destination</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
              {formData.address}, {formData.city}
            </span>
          </div>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-4 rounded-2xl transition-all shadow-md shadow-primary-500/20"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // If cart is empty and not on success, redirect
  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto space-y-6 animate-slide-in">
        <span className="text-5xl">🛍️</span>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Your Checkout is empty</h2>
        <p className="text-xs text-slate-400">Please add products to your cart before accessing the checkout process.</p>
        <Link to="/products" className="inline-block bg-primary-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl">
          View Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 animate-slide-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">Checkout Process</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Provide delivery credentials and payment details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Shipping details form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
          
          {/* Shipping details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary-600" /> Delivery Shipping Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.fullName ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="e.g. John Doe"
                />
                {formErrors.fullName && <span className="text-[10px] font-bold text-rose-500">{formErrors.fullName}</span>}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="e.g. john@example.com"
                />
                {formErrors.email && <span className="text-[10px] font-bold text-rose-500">{formErrors.email}</span>}
              </div>

              <div className="flex flex-col space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.address ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="Street and house number"
                />
                {formErrors.address && <span className="text-[10px] font-bold text-rose-500">{formErrors.address}</span>}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.city ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="e.g. Seattle"
                />
                {formErrors.city && <span className="text-[10px] font-bold text-rose-500">{formErrors.city}</span>}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.state ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="e.g. WA"
                />
                {formErrors.state && <span className="text-[10px] font-bold text-rose-500">{formErrors.state}</span>}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  maxLength="6"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.zipCode ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="e.g. 98101"
                />
                {formErrors.zipCode && <span className="text-[10px] font-bold text-rose-500">{formErrors.zipCode}</span>}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  maxLength="12"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.phone ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="10-digit number"
                />
                {formErrors.phone && <span className="text-[10px] font-bold text-rose-500">{formErrors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Payment card entry */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-600" /> Mock Card Payment details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.cardName ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="e.g. Johnathan Doe"
                />
                {formErrors.cardName && <span className="text-[10px] font-bold text-rose-500">{formErrors.cardName}</span>}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Credit Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  maxLength="16"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.cardNumber ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="16 digits"
                />
                {formErrors.cardNumber && <span className="text-[10px] font-bold text-rose-500">{formErrors.cardNumber}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Expiry Date</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    maxLength="5"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.cardExpiry ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                    placeholder="MM/YY"
                  />
                  {formErrors.cardExpiry && <span className="text-[10px] font-bold text-rose-500">{formErrors.cardExpiry}</span>}
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">CVV</label>
                  <input
                    type="password"
                    name="cardCvv"
                    maxLength="3"
                    value={formData.cardCvv}
                    onChange={handleInputChange}
                    className={`px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.cardCvv ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                    placeholder="3 digits"
                  />
                  {formErrors.cardCvv && <span className="text-[10px] font-bold text-rose-500">{formErrors.cardCvv}</span>}
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* Right Order Review Pane */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Order Summary</h3>

            {/* Cart Items list preview */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[220px] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="py-3 flex justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-slate-400">Qty: {item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal list */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between font-extrabold text-sm text-slate-800 dark:text-slate-100">
                <span>Total Amount</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmitOrder}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-primary-500/20"
            >
              Place Mock Order <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium text-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Dummy Sandbox Transaction (No money will be charged)
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
