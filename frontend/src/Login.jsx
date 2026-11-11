
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from './api.jsx';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setBusy(true);

      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8f8] flex items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-xl shadow-[#164e4a]/10 overflow-hidden border border-[#e4eeee]">

        {/* Left branding section */}
        <section className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#075e62] via-[#087f83] to-[#12a3a0] text-white p-12 xl:p-16 relative overflow-hidden">

          <div className="absolute w-80 h-80 rounded-full border border-white/10 -top-32 -right-32" />
          <div className="absolute w-96 h-96 rounded-full border border-white/10 -bottom-48 -left-24" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-2xl">
                ♥
              </div>
              <span className="text-3xl font-bold tracking-tight">
                Sweety
              </span>
            </div>

            <div className="mt-20">
              <p className="text-sm uppercase tracking-[0.2em] text-teal-100 font-semibold mb-5">
                Your health, your journey
              </p>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Take control of your glucose health.
              </h1>

              <p className="text-teal-50/90 text-lg mt-6 leading-relaxed max-w-md">
                Keep track of your blood glucose readings, understand your patterns, and stay connected with your health journey.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-14 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Your daily progress</p>
                <p className="text-2xl font-bold mt-1">One step at a time</p>
              </div>
              <div className="text-3xl">♡</div>
            </div>
            <div className="mt-5 flex gap-2 items-end h-12">
              {[35, 55, 42, 75, 55, 90, 65, 80, 48, 70, 58, 85].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white/70 rounded-t-md"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-teal-100 mt-3">
              Small steps make a meaningful difference.
            </p>
          </div>

          <p className="relative z-10 text-sm text-teal-100 mt-10">
            Your personal glucose companion.
          </p>
        </section>

        {/* Right login section */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-xl bg-[#087f83] text-white flex items-center justify-center text-2xl">
                ♥
              </div>
              <span className="text-3xl font-bold text-[#087f83]">
                Sweety
              </span>
            </div>

            <div className="mb-9">
              <p className="text-sm font-semibold text-[#087f83] uppercase tracking-wider mb-3">
                Welcome back
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#183238] tracking-tight">
                Sign in to Sweety
              </h2>

              <p className="text-[#71838a] mt-3 leading-relaxed">
                Enter your account details below to continue managing your glucose readings.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">

              {error && (
                <div
                  role="alert"
                  className="text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl"
                >
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#344b50] mb-2">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full h-14 px-4 bg-[#f8fbfb] border border-[#dce8e8] rounded-xl outline-none text-[#183238] placeholder:text-[#a2b2b5] focus:bg-white focus:border-[#087f83] focus:ring-4 focus:ring-[#087f83]/10 transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#344b50] mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full h-14 px-4 pr-16 bg-[#f8fbfb] border border-[#dce8e8] rounded-xl outline-none text-[#183238] placeholder:text-[#a2b2b5] focus:bg-white focus:border-[#087f83] focus:ring-4 focus:ring-[#087f83]/10 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#087f83] hover:text-[#075e62]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full h-14 bg-[#087f83] hover:bg-[#076d71] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl shadow-lg shadow-[#087f83]/20 transition-all"
              >
                {busy ? 'Signing in...' : 'Sign in to your account'}
              </button>

            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#71838a]">
                New to Sweety?{' '}
                <Link
                  to="/register"
                  className="text-[#087f83] font-bold hover:text-[#075e62] hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-12 pt-6 border-t border-[#edf1f1]">
              <p className="text-xs text-center text-[#94a5a8]">
                Sweety · Your personal glucose companion
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
