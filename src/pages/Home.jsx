import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, CreditCard, RotateCcw, Clock } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { CategorySkeleton, ProductCardSkeleton } from '../components/SkeletonCard';
import { formatCurrency } from '../utils/helpers';

const Home = () => {
  const { products, categories, loading, error } = useProducts();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });

  // Simulate deal countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  // Show only top 8 products as featured
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-16 py-4">
      
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[460px] flex items-center shadow-lg">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#4f46e5,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#7c3aed,transparent_50%)] opacity-30" />
        
        <div className="relative z-10 max-w-2xl px-8 sm:px-12 lg:px-16 space-y-6">
          <span className="inline-block px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-primary-200">
            Exclusive Spring Collection
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-primary-300 to-indigo-200 bg-clip-text text-transparent">
              Everyday Vibe
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
            Discover our carefully curated apparel, gadgets, and jewelry designed to match your modern lifestyle. Get 20% off your first checkout!
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-7 py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-primary-500/20"
            >
              Shop Catalog <ShoppingBag className="w-4 h-4" />
            </Link>
            <Link
              to="/products?category=electronics"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm px-7 py-3 rounded-2xl hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              View Tech
            </Link>
          </div>
        </div>

        {/* Floating graphical element */}
        <div className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-white/5 border border-white/10 backdrop-blur-md rounded-[40px] shadow-2xl items-center justify-center p-8 overflow-hidden group rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="text-center space-y-4">
            <span className="text-[80px] leading-none animate-float select-none block">🛍️</span>
            <div className="bg-white/10 px-4 py-2 rounded-2xl inline-block">
              <p className="text-sm font-bold tracking-widest text-primary-200">CODE: VIBE20</p>
            </div>
            <p className="text-xs text-slate-400 font-medium">Apply code VIBE20 at checkout for free delivery.</p>
          </div>
        </div>
      </section>

      {/* 2. Core Category Quick Links */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Browse Categories</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Explore collections by category</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-6">
          {loading ? (
            Array(7).fill(0).map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            categories.map(category => (
              <CategoryCard key={category} category={category} />
            ))
          )}
        </div>
      </section>

      {/* 3. Limited Flash Deals Banner */}
      <section className="relative rounded-3xl p-8 md:p-10 bg-gradient-to-r from-violet-600 via-indigo-600 to-primary-600 text-white overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,white,transparent_70%)] opacity-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-900 rounded-full text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Deal of the Day
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Electronics & Wardrobe Drop Up to 50% Off!
            </h2>
            <p className="text-indigo-100 text-sm max-w-lg">
              Flash promotion is active for limited stocks. Add your items before time runs out.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{formatNumber(timeLeft.hours)}</span>
              <span className="text-[10px] uppercase font-bold text-indigo-200">Hrs</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="flex flex-col items-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{formatNumber(timeLeft.minutes)}</span>
              <span className="text-[10px] uppercase font-bold text-indigo-200">Mins</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="flex flex-col items-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{formatNumber(timeLeft.seconds)}</span>
              <span className="text-[10px] uppercase font-bold text-indigo-200">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Featured Products</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Handpicked catalog favorites trending now</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 group"
          >
            See All Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {error && (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-center border border-rose-100 dark:border-rose-900/50">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 5. Features Trust Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
            <Truck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Free Express Delivery</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">Free courier shipment on cart orders above {formatCurrency(75)}.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">100% Secure Checkout</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">Dummy transactions protected via simulated SSL gateways.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">30-Days Return Policy</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">Unsatisfied? Exchange or request returns within 30 days easily.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
