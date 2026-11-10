
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from './api.jsx';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Check password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setBusy(true);

      // Send registration data to backend
      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password
        })
      });

      alert(data.message || 'Account created successfully!');

      // Redirect to login page
      navigate('/');

    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f6f8] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-[408px]">

        {/* Application branding */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#087f83]">
            Sweety
          </h1>

          <p className="text-[#5c6b7c] mt-1 text-base">
            Track your blood glucose, one reading at a time.
          </p>
        </header>

        {/* Registration card */}
        <section className="bg-white border border-[#d8e0e8] rounded-lg p-6">

          <h2 className="text-xl font-semibold text-[#202b36]">
            Create an account
          </h2>

          <p className="text-sm text-[#5c6b7c] mt-1 mb-5">
            Join Sweety and start tracking your glucose readings.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3"
              >
                {error}
              </p>
            )}

            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1.5"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="w-full h-[42px] px-3 border border-[#d8e0e8] rounded-md outline-none focus:border-[#087f83] focus:ring-2 focus:ring-[#087f83]/15"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
              >
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full h-[42px] px-3 border border-[#d8e0e8] rounded-md outline-none focus:border-[#087f83] focus:ring-2 focus:ring-[#087f83]/15"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1.5"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full h-[42px] px-3 border border-[#d8e0e8] rounded-md outline-none focus:border-[#087f83] focus:ring-2 focus:ring-[#087f83]/15"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 bg-[#087f83] hover:bg-[#076e72] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors"
            >
              {busy ? 'Creating account...' : 'Create account'}
            </button>

          </form>
        </section>

        {/* Login navigation */}
        <p className="text-center text-sm text-[#5c6b7c] mt-5">
          Already have an account?{' '}
          <Link
            to="/"
            className="text-[#087f83] font-semibold underline"
          >
            Log in
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Register;
