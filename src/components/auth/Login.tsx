import { useState, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../services/api';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2 } from 'lucide-react';

interface LoginProps {
  onToggleForm: () => void;
}

export default function Login({ onToggleForm }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, setError, loading, setLoading } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await authApi.login({ email, password });

    if (response.success && response.data) {
      const { accessToken, refreshToken, user } = response.data;
      login(email, accessToken, refreshToken, user);
    } else {
      setError(response.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-[#111111] border border-white/5 rounded-3xl shadow-2xl"
    >
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white mx-auto mb-4">Q</div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-500">Sign in to continue your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-3 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-3 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 text-white"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Don't have an account?{' '}
          <button onClick={onToggleForm} className="text-blue-500 hover:text-blue-400 font-medium">
            Create Account
          </button>
        </p>
      </div>
    </motion.div>
  );
}
