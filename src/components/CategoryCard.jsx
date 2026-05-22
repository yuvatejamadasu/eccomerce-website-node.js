import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Sparkles, Shirt, Gem, Glasses, Dumbbell, Home } from 'lucide-react';

const CategoryCard = ({ category }) => {
  // Map standard categories to icons, gradients and labels
  const themeMap = {
    "electronics": {
      icon: <Laptop className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-blue-500 to-indigo-600 shadow-blue-500/20",
      label: "Electronics"
    },
    "jewelery": {
      icon: <Gem className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-amber-400 to-orange-500 shadow-amber-500/20",
      label: "Jewelery"
    },
    "men's clothing": {
      icon: <Shirt className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-violet-500 to-purple-600 shadow-violet-500/20",
      label: "Men's Wear"
    },
    "women's clothing": {
      icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-pink-400 to-rose-500 shadow-pink-500/20",
      label: "Women's Wear"
    },
    "fashion": {
      icon: <Glasses className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-emerald-400 to-teal-500 shadow-emerald-500/20",
      label: "Fashion"
    },
    "sports": {
      icon: <Dumbbell className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-cyan-400 to-blue-600 shadow-cyan-500/20",
      label: "Sports"
    },
    "home & living": {
      icon: <Home className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-amber-500 to-rose-500 shadow-amber-500/20",
      label: "Home & Living"
    }
  };

  const defaultTheme = {
    icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
    gradient: "from-primary-500 to-indigo-600 shadow-primary-500/20",
    label: category
  };

  const theme = themeMap[category.toLowerCase()] || defaultTheme;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category)}`}
      className="flex flex-col items-center space-y-3 group p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors duration-300"
    >
      <div className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr ${theme.gradient} text-white shadow-lg group-hover:scale-110 active:scale-95 transition-all duration-300`}>
        {theme.icon}
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-inherit blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
      </div>
      <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center tracking-tight capitalize group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {theme.label}
      </span>
    </Link>
  );
};

export default CategoryCard;
