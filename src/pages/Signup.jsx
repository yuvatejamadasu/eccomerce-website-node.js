import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/helpers';

const Signup = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full Name is required';
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = 'Valid email address is required';
    }
    if (!password.trim() || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix form validation errors!', 'warning');
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate signup lag
    setTimeout(async () => {
      setLoading(false);
      const res = await signup(name, email, password);
      if (res.success) {
        showToast(`Welcome to ShopVibe, ${name}! Your account has been registered!`, 'success');
        navigate('/');
      } else {
        showToast(res.message, 'error');
      }
    }, 800);
  };

  return (
    <div className="py-12 flex items-center justify-center min-h-[620px] animate-slide-in">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl glass-effect space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
            Join ShopVibe to build wishlists, track parcels, and checkout quickly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          
          {/* Full name */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {errors.name && <span className="text-[10px] font-bold text-rose-500">{errors.name}</span>}
          </div>

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

          {/* Confirm Password */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retype password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.confirmPassword ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {errors.confirmPassword && <span className="text-[10px] font-bold text-rose-500">{errors.confirmPassword}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-primary-500/20"
          >
            {loading ? 'Creating secure profile...' : 'Register Profile'} <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Login Redirect */}
        <div className="text-center text-xs">
          <p className="text-slate-400 font-semibold">
            Already have an active account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-bold">
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
