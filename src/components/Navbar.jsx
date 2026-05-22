import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Sun, Moon, User, Search, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully!', 'info');
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-effect shadow-sm transition-all duration-300 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-300">
              ShopVibe
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              placeholder="Search products, brands and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Nav Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/products?wishlist=true"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-rose-500 text-white font-bold text-[10px] rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary-600 text-white font-bold text-[10px] rounded-full ring-2 ring-white dark:ring-slate-900">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-900">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-xs font-semibold max-w-[80px] truncate">{user.name}</span>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-in">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                      </div>
                      <Link
                        to="/checkout"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <User className="w-4 h-4" />
                        My Checkout
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 p-4 bg-white/95 dark:bg-slate-900/95 glass-effect space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </button>
          </form>
          <div className="flex flex-col gap-2 font-medium">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 text-sm">
              All Products
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 text-sm flex justify-between">
              <span>Shopping Cart</span>
              <span className="bg-primary-600 text-white px-2 py-0.5 rounded-full text-[10px]">{totalItemsCount}</span>
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.name})
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 text-sm">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
