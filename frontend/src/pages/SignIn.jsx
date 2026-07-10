import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, AlertCircle, Shield } from 'lucide-react';
import { authApi } from '../services/api';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Dispatch storage event to trigger Header updates
      window.dispatchEvent(new Event('storage'));

      // Redirect based on role
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else if (userData.role === 'DRIVER') {
        navigate('/driver');
      } else {
        navigate('/book');
      }
      
      // Force reload to refresh Header state cleanly
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-6 overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-safety-pink/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative">
        
        {/* Header/Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-safety-pink to-safety-purple text-white shadow-glow-pink mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-200">Sign In to Gonari</h2>
          <p className="text-gray-400 text-xs mt-1">Exclusively for women, girls, and families</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-input pl-12 pr-4 py-3.5 rounded-xl text-sm text-white w-full"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="glass-input pl-12 pr-4 py-3.5 rounded-xl text-sm text-white w-full"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-4 rounded-xl font-bold bg-gradient-to-r from-safety-pink to-safety-purple text-white shadow-glow-pink hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-safety-pink hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
