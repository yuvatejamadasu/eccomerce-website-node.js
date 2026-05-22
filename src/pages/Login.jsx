import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/helpers';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = 'Valid email address is required';
    }
    if (!password.trim() || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please correct form errors!', 'warning');
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate login lag
    setTimeout(async () => {
      setLoading(false);
      const res = await login(email, password);
      if (res.success) {
        showToast('Login successful! Welcome back!', 'success');
        navigate(from, { replace: true });
      } else {
        showToast(res.message, 'error');
      }
    }, 800);
  };

  return (
    <div className="py-12 flex items-center justify-center min-h-[580px] animate-slide-in">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl glass-effect space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Login Form</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
            Login to your ShopVibe profile to process saved carts and checkouts
          </p>
        </div>

        {/* Demo Account Indicator */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-2.5">
          <p className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <span>💡</span> Sandbox Demo Credentials
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-400">
            <div className="space-y-1">
              <span className="font-extrabold text-[10px] text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Email Options</span>
              <div className="flex flex-col gap-1">
                <code className="font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-200/60 dark:border-slate-800/80 block select-all">admin@shopvibe.com</code>
                <code className="font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-200/60 dark:border-slate-800/80 block select-all">adming@shopvibe.com</code>
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-[10px] text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Password</span>
              <code className="font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-200/60 dark:border-slate-800/80 block select-all">admin123</code>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {errors.email && <span className="text-[10px] font-bold text-rose-500">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {errors.password && <span className="text-[10px] font-bold text-rose-500">{errors.password}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-primary-500/20"
          >
            {loading ? 'Logging in secure gateway...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Signup Redirect */}
        <div className="text-center text-xs">
          <p className="text-slate-400 font-semibold">
            Don't have a profile yet?{' '}
            <Link to="/signup" className="text-primary-600 hover:underline font-bold">
              Sign Up for Free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
