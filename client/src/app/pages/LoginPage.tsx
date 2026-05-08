import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(nik, password);
      navigate(user.role === 'admin' ? '/admin-home' : '/', { replace: true });
    } catch {
      setError('Invalid NIK or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#615fff] via-[#4f39f6] to-[#9810fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[416px] rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-white/10 shadow mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">W+</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Workspace+</h1>
          <p className="text-white/75 text-sm mt-1">Smart Desk System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Employee NIK</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl shadow-inner shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-white/80 tracking-[0.12em]"
                placeholder="Enter your NIK"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl shadow-inner shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-white/80"
                placeholder="Input password"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setError('Please contact your Workspace+ administrator to reset your password.')}
              className="block ml-auto mt-2 text-xs text-white/80 underline hover:text-white"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#605eff]/80 text-white font-semibold py-3.5 shadow-lg hover:bg-[#605eff] transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/10">
          <p className="text-xs font-semibold text-white mb-2">Demo Credentials:</p>
          <div className="text-xs text-white/80 space-y-1">
            <p>User: NIK <span className="font-mono font-bold text-white">456</span> / Password <span className="font-mono font-bold text-white">demo</span></p>
            <p>Admin: NIK <span className="font-mono font-bold text-white">567</span> / Password <span className="font-mono font-bold text-white">demo</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
