
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from './api.jsx';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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

      // Save authentication details
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Open dashboard after successful login
      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f6f8] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-[408px]">

        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#087f83]">
            Sweety
          </h1>

          <p className="text-[#5c6b7c] mt-1">
            Track your blood glucose, one reading at a time.
          </p>
        </header>

        <section className="bg-white border border-[#d8e0e8] rounded-lg p-6">

          <h2 className="text-xl font-semibold text-[#202b36]">
            Log in
          </h2>

          <p className="text-sm text-[#5c6b7c] mt-1 mb-5">
            Welcome back. Enter your details to see your readings.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 bg-red-50 p-3 rounded-md"
              >
                {error}
              </p>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full h-[42px] px-3 border border-[#d8e0e8] rounded-md outline-none focus:border-[#087f83] focus:ring-2 focus:ring-[#087f83]/15"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full h-[42px] px-3 border border-[#d8e0e8] rounded-md outline-none focus:border-[#087f83] focus:ring-2 focus:ring-[#087f83]/15"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 bg-[#087f83] hover:bg-[#076e72] disabled:opacity-60 text-white font-semibold rounded-md transition-colors"
            >
              {busy ? 'Logging in...' : 'Log in'}
            </button>

          </form>
        </section>

        <p className="text-center text-sm text-[#5c6b7c] mt-5">
          New to Sweety?{' '}
          <Link
            to="/register"
            className="text-[#087f83] font-semibold underline"
          >
            Create an account
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Login;
