import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for subscribing to our newsletter!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 mt-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Newsletter & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12 border-b border-slate-100 dark:border-slate-800">
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-300">
              ShopVibe
            </Link>
            <p className="text-sm max-w-md">
              Experience online shopping re-imagined. Fast delivery, secure payment channels, and curation of the finest global catalogs right at your fingertips.
            </p>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Subscribe to our Newsletter for exclusive VIP discounts & drops
            </h4>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shadow-primary-500/20"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          
          {/* Shop */}
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase">Shop</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=jewelery" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Jewelery</Link></li>
              <li><Link to="/products?category=men's clothing" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Men's Apparel</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About ShopVibe</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Press Releases</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Our Blog</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase">Help</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Track Orders</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Customer Care</a></li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase">Connect</h5>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 dark:hover:text-primary-400 transition-all flex items-center justify-center" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 dark:hover:text-primary-400 transition-all flex items-center justify-center" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 dark:hover:text-primary-400 transition-all flex items-center justify-center" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-xl max-w-max">
              <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encryption
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-8 text-xs gap-4">
          <p>© {new Date().getFullYear()} ShopVibe Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for extreme performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
