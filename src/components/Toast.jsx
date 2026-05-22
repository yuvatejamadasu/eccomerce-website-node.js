import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    // We handle timer in the ToastContext provider
  }, []);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const borders = {
    success: 'border-l-4 border-l-emerald-500',
    warning: 'border-l-4 border-l-amber-500',
    error: 'border-l-4 border-l-rose-500',
    info: 'border-l-4 border-l-sky-500',
  };

  return (
    <div className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 glass-effect ${borders[type]} animate-slide-in duration-300 w-full`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose} 
        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
