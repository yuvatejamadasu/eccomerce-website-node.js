import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldAlert, ShoppingCart, Heart, ShieldCheck, ChevronRight, MessageSquareCode, Truck, RotateCcw, Award, CheckSquare, Plus, MapPin } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/helpers';
import { ProductDetailsSkeleton } from '../components/SkeletonCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [selectedPack, setSelectedPack] = useState('pack-1');
  const [activeOfferModal, setActiveOfferModal] = useState(null); // 'cashback' | 'bank' | null

  // Bundle states for "Frequently Bought Together"
  const [includeMain, setIncludeMain] = useState(true);
  const [includeSecondary, setIncludeSecondary] = useState(true);

  const isSaved = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    let isMounted = true;
    const loadDetailsAndRelated = async () => {
      try {
        setLoading(true);
        const [detailsData, listData] = await Promise.all([
          fetchProductById(id),
          fetchProducts()
        ]);
        if (isMounted) {
          setProduct(detailsData);
          setActiveImage(detailsData.image);
          setAllProducts(listData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('We could not load the details for this item. Please try again!');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadDetailsAndRelated();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Secondary bundle product (first item from same category that is not this product)
  const secondaryProduct = useMemo(() => {
    if (!product || allProducts.length === 0) return null;
    return allProducts.find(p => p.category === product.category && p.id !== product.id) || allProducts.find(p => p.id !== product.id);
  }, [product, allProducts]);

  // Related products carousel
  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  }, [product, allProducts]);

  // Pack selector adjustments
  const isPack2 = selectedPack === 'pack-2';
  const discountPercent = 15;

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    return isPack2 ? product.price * 1.8 : product.price;
  }, [product, isPack2]);

  const originalPrice = useMemo(() => {
    return currentPrice / (1 - discountPercent / 100);
  }, [currentPrice]);

  const handleAddToCart = () => {
    if (product) {
      const formattedTitle = isPack2 ? `${product.title} (Pack of 2)` : product.title;
      addToCart({
        ...product,
        price: currentPrice,
        title: formattedTitle
      }, quantity);
      showToast(`Added ${quantity} x "${formattedTitle.substring(0, 25)}..." to your cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const formattedTitle = isPack2 ? `${product.title} (Pack of 2)` : product.title;
      addToCart({
        ...product,
        price: currentPrice,
        title: formattedTitle
      }, quantity);
      navigate('/checkout');
    }
  };

  const handleAddBundleToCart = () => {
    if (!includeMain && !includeSecondary) {
      showToast('Select at least one item to bundle!', 'warning');
      return;
    }
    let addedCount = 0;
    if (includeMain && product) {
      addToCart({
        ...product,
        price: currentPrice,
        title: isPack2 ? `${product.title} (Pack of 2)` : product.title
      }, 1);
      addedCount++;
    }
    if (includeSecondary && secondaryProduct) {
      addToCart(secondaryProduct, 1);
      addedCount++;
    }
    showToast(`Added ${addedCount} bundle item(s) to your cart!`, 'success');
  };

  const handleWishlistToggle = async () => {
    if (product) {
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
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="py-16 text-center space-y-6">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Failed to load product details</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{error || 'Product not found.'}</p>
        <Link to="/products" className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const ratingRate = product.rating?.rate || 4.3;
  const ratingCount = product.rating?.count || 405;

  // Bundle calculations
  const secondaryPrice = secondaryProduct ? secondaryProduct.price : 0;
  const bundleTotalPrice = (includeMain ? currentPrice : 0) + (includeSecondary ? secondaryPrice : 0);

  return (
    <div className="space-y-12 py-4 text-slate-800 dark:text-slate-100">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
        <Link to="/" className="hover:text-primary-600 hover:underline transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-primary-600 hover:underline transition-colors">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-600 hover:underline transition-colors capitalize">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-500 dark:text-slate-300 font-normal truncate max-w-[250px]">{product.title}</span>
      </nav>

      {/* 2. Amazon Three-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= COLUMN 1: GALLERY IMAGES (3 cols) ================= */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
          
          {/* Vertical Thumbnail List */}
          <div className="flex md:flex-col flex-row gap-2 order-2 md:order-1">
            {[product.image, product.image, product.image].map((img, index) => (
              <button
                key={index}
                onMouseEnter={() => setActiveImage(img)}
                onClick={() => setActiveImage(img)}
                className={`w-14 h-14 p-1.5 bg-white dark:bg-slate-900 border rounded-lg flex items-center justify-center transition-all ${activeImage === img ? 'border-primary-600 ring-1 ring-primary-600' : 'border-slate-200 dark:border-slate-800 hover:border-primary-500'}`}
              >
                <img src={img} alt="thumbnail" className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </button>
            ))}
          </div>

          {/* Main Large Image Container */}
          <div className="flex-1 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center aspect-square relative order-1 md:order-2 overflow-hidden group">
            <img
              src={activeImage}
              alt={product.title}
              className="max-h-[340px] object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
            />
            {/* Wishlist Heart Toggle */}
            <button
              onClick={handleWishlistToggle}
              className="absolute right-4 top-4 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-full border border-slate-200/50 dark:border-slate-800 text-slate-400 hover:text-rose-500 shadow-md transition-colors"
            >
              <Heart className={`w-4 h-4 transition-all ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'}`} />
            </button>
          </div>

        </div>

        {/* ================= COLUMN 2: MIDDLE PRODUCT INFO (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
              {product.title}
            </h1>
            <a href="#" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-primary-600 hover:underline font-bold block">
              Visit the ShopVibe Store
            </a>

            {/* Stars Review row */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-400">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(ratingRate) ? 'fill-current text-amber-500' : 'text-slate-200 dark:text-slate-800'}`} />
                ))}
              </div>
              <a href="#reviews" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-primary-600 hover:underline font-bold">
                {ratingRate} ({ratingCount} ratings)
              </a>
              <span className="text-[10px] text-slate-400 font-bold border-l border-slate-200 pl-2">
                Amazon's Choice
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-bold mt-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded max-w-max">
              100+ bought in past month
            </p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Pricing Block - ALIGNED PERFECTLY */}
          <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-light text-rose-600">-{discountPercent}%</span>
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center">
                {formatCurrency(currentPrice)}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-semibold pl-1 space-y-0.5">
              <p>M.R.P.: <span className="line-through">{formatCurrency(originalPrice)}</span></p>
              <p className="text-[11px] text-slate-500 font-bold">Inclusive of all taxes</p>
            </div>
          </div>

          {/* Offers Row - INTERACTIVE MODAL BUTTONS */}
          <div className="space-y-2.5">
            <span className="text-xs font-extrabold flex items-center gap-1.5">
              🏷️ Offers available on this item
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-[11px] bg-white dark:bg-slate-900">
                <p className="font-extrabold text-slate-900 dark:text-slate-100">Cashback</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Upto ₹150 cashback on ShopVibe Pay Balance...</p>
                <button 
                  onClick={(e) => { e.preventDefault(); setActiveOfferModal('cashback'); }}
                  className="text-primary-600 hover:underline font-bold text-left block"
                >
                  1 offer &gt;
                </button>
              </div>
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-[11px] bg-white dark:bg-slate-900">
                <p className="font-extrabold text-slate-900 dark:text-slate-100">Bank Offer</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">10% Instant Discount up to ₹500 on AU Cards...</p>
                <button 
                  onClick={(e) => { e.preventDefault(); setActiveOfferModal('bank'); }}
                  className="text-primary-600 hover:underline font-bold text-left block"
                >
                  2 offers &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Service Promises Row */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] text-slate-400 font-bold">
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <Truck className="w-4 h-4 text-primary-600" />
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <RotateCcw className="w-4 h-4 text-primary-600" />
              <span>Non-Returnable</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <Award className="w-4 h-4 text-primary-600" />
              <span>Top Brand</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>Secure Pay</span>
            </div>
          </div>

          {/* Sizes or Pack Variants - THEMED TO PURPLE */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase block">Size Options:</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                onClick={() => setSelectedPack('pack-1')}
                className={`px-3 py-2 border rounded-lg text-left space-y-0.5 transition-all ${selectedPack === 'pack-1' ? 'border-primary-600 bg-primary-600/5 ring-1 ring-primary-600' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <p className="font-bold text-slate-950 dark:text-white">Standard Pack (Single)</p>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{formatCurrency(product.price)}</p>
              </button>
              <button
                onClick={() => setSelectedPack('pack-2')}
                className={`px-3 py-2 border rounded-lg text-left space-y-0.5 transition-all ${selectedPack === 'pack-2' ? 'border-primary-600 bg-primary-600/5 ring-1 ring-primary-600' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <p className="font-bold text-slate-950 dark:text-white">Pack of 2 (Bundle)</p>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{formatCurrency(product.price * 1.8)}</p>
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Product Description bullet list */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Top Highlights</h3>
            <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <li>Premium quality curated for style and lightweight, active comfort.</li>
              <li>High-durability craftsmanship with reinforced stitching.</li>
              <li>Eco-friendly non-toxic certified base materials.</li>
              <li>Ideal for both daily travel utility and professional settings.</li>
            </ul>
          </div>

        </div>

        {/* ================= COLUMN 3: STICKY BUY BOX (3 cols) ================= */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          
          <div className="space-y-1">
            <span className="text-2xl font-bold">{formatCurrency(currentPrice)}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-primary-600 font-bold hover:underline cursor-pointer">FREE delivery</span> Tuesday, 26 May.
            </p>
          </div>

          {/* Pincode Map selector */}
          <div className="flex items-center gap-1.5 text-xs text-primary-600 font-medium cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Delivering to Hyderabad 500055 - Update location</span>
          </div>

          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded max-w-max">
            In stock
          </p>

          <div className="text-[11px] text-slate-500 space-y-1 font-semibold">
            <p>Payment: <span className="text-slate-700 dark:text-slate-300">Secure transaction</span></p>
            <p>Ships from: <span className="text-slate-700 dark:text-slate-300">ShopVibe Amazon Hub</span></p>
            <p>Sold by: <span className="text-primary-600 hover:underline">Ray Health Product Pvt Ltd</span></p>
          </div>

          {/* Quantity Selector dropdown */}
          <div className="flex items-center justify-between text-xs font-bold border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950">
            <span className="text-slate-400 uppercase">Quantity:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none pr-1 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Purple Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 rounded-full shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            Add to Cart
          </button>

          {/* Deep Indigo Buy Now */}
          <button
            onClick={handleBuyNow}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs py-3 rounded-full shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            Buy Now
          </button>

          <button
            onClick={handleWishlistToggle}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-primary-600 hover:underline pt-2"
          >
            {isSaved ? '❤️ Added to Wish List' : '🤍 Add to Wish List'}
          </button>

        </div>

      </div>

      {/* ================= BUNDLE CHECKOUT: FREQUENTLY BOUGHT TOGETHER ================= */}
      {secondaryProduct && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Frequently bought together
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="flex items-center flex-wrap gap-4">
              
              {/* Product 1 */}
              <div className={`flex items-center gap-3 ${!includeMain && 'opacity-40'}`}>
                <div className="w-16 h-16 p-2 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                  <img src={product.image} alt={product.title} className="max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold truncate max-w-[150px]">{product.title}</p>
                  <p className="text-xs font-bold text-slate-400">{formatCurrency(currentPrice)}</p>
                </div>
              </div>

              <Plus className="w-5 h-5 text-slate-300" />

              {/* Product 2 */}
              <div className={`flex items-center gap-3 ${!includeSecondary && 'opacity-40'}`}>
                <div className="w-16 h-16 p-2 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                  <img src={secondaryProduct.image} alt={secondaryProduct.title} className="max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold truncate max-w-[150px]">{secondaryProduct.title}</p>
                  <p className="text-xs font-bold text-slate-400">{formatCurrency(secondaryProduct.price)}</p>
                </div>
              </div>

            </div>

            {/* Checkbox triggers + bundle buy */}
            <div className="space-y-3 shrink-0 text-center lg:text-left">
              <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMain}
                    onChange={(e) => setIncludeMain(e.target.checked)}
                    className="accent-primary-600 rounded"
                  />
                  <span>This item: {product.title.substring(0, 30)}... <b className="text-slate-800 dark:text-slate-200">{formatCurrency(currentPrice)}</b></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSecondary}
                    onChange={(e) => setIncludeSecondary(e.target.checked)}
                    className="accent-primary-600 rounded"
                  />
                  <span>Recommend addition: {secondaryProduct.title.substring(0, 30)}... <b className="text-slate-800 dark:text-slate-200">{formatCurrency(secondaryProduct.price)}</b></span>
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                <p className="text-sm font-bold">
                  Total Price: <span className="text-rose-600 font-extrabold">{formatCurrency(bundleTotalPrice)}</span>
                </p>
                <button
                  onClick={handleAddBundleToCart}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-5 py-2 rounded-full shadow-sm cursor-pointer"
                >
                  Add both to Cart
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ================= SLIDER CAROUSEL: RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Customers who viewed this item also viewed
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {relatedProducts.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all space-y-3"
              >
                <div className="h-32 w-full flex items-center justify-center p-2">
                  <img src={p.image} alt={p.title} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{p.title}</p>
                  <div className="flex items-center text-amber-500 text-[10px]">
                    <Star className="w-3 h-3 fill-current text-amber-500 mr-0.5" />
                    <span>{p.rating?.rate || 4.2}</span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= RATINGS & REVIEWS FEED ================= */}
      <section className="pt-12 border-t border-slate-200/50 dark:border-slate-800/50 space-y-6" id="reviews">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <MessageSquareCode className="w-5 h-5 text-primary-600" /> Customer Ratings & Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center space-y-3">
            <span className="text-5xl font-extrabold text-slate-800 dark:text-slate-100">{ratingRate}</span>
            <div className="flex items-center text-amber-400">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(ratingRate) ? 'fill-current text-amber-500' : 'text-slate-200 dark:text-slate-800'}`} />
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Average Score based on {ratingCount} scores</p>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {[
              { id: 1, author: "Sarah Connor", rating: 5, date: "May 10, 2026", comment: "Outstanding build quality! Speed of shipment was remarkable too. Definitely buying another one." },
              { id: 2, author: "John Doe", rating: 4, date: "May 02, 2026", comment: "Item matches description. The materials are comfortable and light. Took about 3 days to deliver." },
              { id: 3, author: "Emily Watson", rating: 3, date: "April 28, 2026", comment: "Decent value for money, though is slightly smaller than expected. I recommend ordering a size up!" }
            ].map(rev => (
              <div key={rev.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{rev.author}</span>
                  <span className="text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center text-amber-500">
                  {Array(rev.rating).fill(0).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Detail Modal Overlay */}
      {activeOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏷️</span> {activeOfferModal === 'cashback' ? 'Cashback Terms' : 'Bank Offer Terms'}
              </h3>
              <button 
                onClick={() => setActiveOfferModal(null)}
                className="text-slate-400 hover:text-primary-600 font-extrabold text-sm p-1"
              >
                ✕
              </button>
            </div>
            
            {activeOfferModal === 'cashback' ? (
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Get up to ₹150 Cashback on ShopVibe Pay Balance.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Minimum purchase value of ₹1,500 required.</li>
                  <li>Offer applicable only on purchases made using ShopVibe Pay UPI option.</li>
                  <li>Cashback will be credited within 24 hours of successful order delivery.</li>
                  <li>Valid once per user during the promotional calendar month.</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <p className="font-semibold text-slate-800 dark:text-slate-200">10% Instant Discount on partner bank cards.</p>
                <div className="space-y-2.5">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                    <p className="font-bold text-slate-800 dark:text-slate-200">AU Bank Credit Cards:</p>
                    <p>10% instant discount up to ₹500. Minimum purchase of ₹3,000.</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Axis Bank Cards:</p>
                    <p>5% unlimited cashback on Flipkart Axis Credit Card. No minimum order required.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveOfferModal(null)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-2.5 rounded-full shadow-sm"
            >
              Close Offer Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
