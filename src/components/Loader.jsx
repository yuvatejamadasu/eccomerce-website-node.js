import React from 'react';

const Loader = ({ fullPage = false, message = "Loading the experience..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-slate-800 opacity-75"></div>
        {/* Spinning element */}
        <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 dark:border-t-primary-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
