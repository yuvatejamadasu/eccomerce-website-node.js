import React from 'react';

// Product Grid Card Placeholder
export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="shimmer-bg h-60 w-full"></div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category */}
          <div className="shimmer-bg h-4 w-1/4 rounded"></div>
          {/* Title */}
          <div className="shimmer-bg h-6 w-full rounded"></div>
          <div className="shimmer-bg h-6 w-5/6 rounded"></div>
        </div>
        
        {/* Rating and Price */}
        <div className="flex justify-between items-center pt-2">
          <div className="shimmer-bg h-5 w-1/3 rounded"></div>
          <div className="shimmer-bg h-6 w-1/4 rounded"></div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="shimmer-bg h-10 flex-1 rounded-xl"></div>
          <div className="shimmer-bg h-10 w-10 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

// Circle Category Placeholder
export const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center space-y-2 p-2">
      <div className="shimmer-bg w-20 h-20 md:w-24 md:h-24 rounded-full"></div>
      <div className="shimmer-bg h-4 w-16 rounded mt-1"></div>
    </div>
  );
};

// Full Product Details Page Placeholder
export const ProductDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8 animate-pulse">
      {/* Left Column: Image gallery skeleton */}
      <div className="space-y-4">
        <div className="shimmer-bg aspect-square w-full rounded-2xl"></div>
        <div className="flex gap-4">
          <div className="shimmer-bg h-20 w-20 rounded-xl"></div>
          <div className="shimmer-bg h-20 w-20 rounded-xl"></div>
          <div className="shimmer-bg h-20 w-20 rounded-xl"></div>
        </div>
      </div>
      
      {/* Right Column: Title, ratings, details, actions */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="shimmer-bg h-4 w-1/4 rounded"></div>
          <div className="shimmer-bg h-10 w-3/4 rounded"></div>
          <div className="shimmer-bg h-6 w-1/2 rounded"></div>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center gap-6 py-2 border-y border-slate-100 dark:border-slate-800">
          <div className="shimmer-bg h-8 w-1/4 rounded"></div>
          <div className="shimmer-bg h-6 w-1/3 rounded"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="shimmer-bg h-4 w-full rounded"></div>
          <div className="shimmer-bg h-4 w-full rounded"></div>
          <div className="shimmer-bg h-4 w-3/4 rounded"></div>
        </div>

        {/* Selection actions */}
        <div className="space-y-4 pt-4">
          <div className="shimmer-bg h-6 w-1/3 rounded"></div>
          <div className="flex gap-4">
            <div className="shimmer-bg h-12 w-1/3 rounded-xl"></div>
            <div className="shimmer-bg h-12 flex-1 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
