import React, { useState } from 'react';
import { Camera, Lock, User, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState('admin12345');
  const [password, setPassword] = useState('admin12345');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(username.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid credentials. Please verify your login details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSite = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 antialiased selection:bg-amber-400 selection:text-neutral-950">
      <div className="w-full max-w-md">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-amber-400 mb-4 shadow-xl">
            <Camera className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif tracking-tight text-neutral-100 font-normal">
            FLAMES PHOTOGRAPHY
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mt-1">
            Curator & Editorial CMS
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-7 md:p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-neutral-200">Admin Authentication</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Enter your curator credentials to manage portfolio assets.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin12345"
                  className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-10 pr-11 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold rounded-xl text-xs uppercase tracking-widest transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  SIGN IN TO DASHBOARD
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-300 font-mono">
              Default Credentials:{' '}
              <span className="text-neutral-200 font-bold">admin12345</span> /{' '}
              <span className="text-neutral-200 font-bold">admin12345</span>
            </p>
          </div>
        </div>

        {/* Return to Public Site */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleBackToSite}
            className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors font-mono tracking-wider"
          >
            ← Return to public photography website
          </button>
        </div>
      </div>
    </div>
  );
};
