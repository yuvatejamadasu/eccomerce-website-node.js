import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonCard';

const ITEMS_PER_PAGE = 8;

const ProductList = () => {
  const { products, categories, loading, error } = useProducts();
  const { wishlistItems } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const urlWishlist = searchParams.get('wishlist') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setCurrentPage(1); // Reset page on query shift
  }, [urlCategory, urlSearch, urlWishlist, sortBy]);

  // Handle Search Input Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('wishlist'); // Clear wishlist view when shifting categories
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSelectedCategory(category);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter and Sort Data
  const processedProducts = useMemo(() => {
    let list = urlWishlist ? [...wishlistItems] : [...products];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Search Query
    if (urlSearch) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(urlSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(urlSearch.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    return list;
  }, [products, wishlistItems, selectedCategory, urlSearch, urlWishlist, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  return (
    <div className="py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            {urlWishlist ? 'My Saved Wishlist' : 'Products Catalog'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
            {processedProducts.length} items found
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex md:hidden items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Sorter Selector */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 rounded-xl text-sm font-medium w-full sm:w-48 shadow-sm">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none w-full"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Sort: High Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Filter & Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS (Desktop Panel) */}
        <aside className="hidden md:block space-y-6">
          {/* Categories card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Categories</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`text-left text-sm font-bold py-1.5 px-3 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left text-sm font-bold py-1.5 px-3 rounded-xl transition-all capitalize ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside sidebar */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Search Keywords</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Type and enter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Reset button */}
          {(selectedCategory !== 'all' || searchQuery !== '' || sortBy !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
            >
              Reset Filters
            </button>
          )}
        </aside>

        {/* MOBILE DRAWER FILTERS */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-80 bg-white dark:bg-slate-900 h-full p-6 space-y-6 overflow-y-auto animate-slide-in flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Catalog Filters</h3>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase text-slate-400">Categories</h4>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { handleCategorySelect('all'); setSidebarOpen(false); }}
                      className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { handleCategorySelect(cat); setSidebarOpen(false); }}
                        className={`text-left text-sm font-semibold py-2 px-3 rounded-xl transition-all capitalize ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase text-slate-400">Live Search</h4>
                  <form onSubmit={(e) => { handleSearchSubmit(e); setSidebarOpen(false); }} className="relative">
                    <input
                      type="text"
                      placeholder="Type keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => { handleResetFilters(); setSidebarOpen(false); }}
                className="w-full py-3 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl dark:bg-rose-950/30 dark:text-rose-400 uppercase tracking-widest"
              >
                Reset & Close
              </button>
            </div>
          </div>
        )}

        {/* PRODUCTS GRID (Right Panel) */}
        <main className="md:col-span-3 space-y-8">
          {error && (
            <div className="p-8 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-center border border-rose-100 dark:border-rose-900/50">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {/* Empty States */}
          {!loading && paginatedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center p-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className="text-5xl animate-bounce">🔍</span>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No items matched your filter criteria</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Try widening your search terms, switching categories, or resetting filters!
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl"
              >
                Reset Catalog Filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 disabled:opacity-50 disabled:pointer-events-none hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 disabled:opacity-50 disabled:pointer-events-none hover:bg-slate-50 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ProductList;
