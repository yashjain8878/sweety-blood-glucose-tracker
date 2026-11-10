
import { useState } from 'react';
import ReadingForm from './ReadingForm.jsx';
import { useNavigate } from 'react-router-dom';
import DailyReadings from './DailyReadings.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-[#f3f6f8]">

      {/* Navigation */}
      <header className="bg-white border-b border-[#d8e0e8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          <h1 className="text-2xl font-bold text-[#087f83]">
            Sweety
          </h1>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-[#5c6b7c]">
              {user.name || 'User'}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-[#087f83] hover:underline"
            >
              Log out
            </button>
          </div>

        </div>
      </header>

      {/* Dashboard content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#202b36]">
            Welcome, {user.name || 'User'}!
          </h2>

          <p className="text-[#5c6b7c] mt-1">
            Here's an overview of your blood glucose readings.
          </p>
        </div>

        {/* Date selection */}
        <section className="bg-white border border-[#d8e0e8] rounded-lg p-5 mb-6">

          <label
            htmlFor="readingDate"
            className="block text-sm font-semibold mb-2"
          >
            Select date
          </label>

          <input
            id="readingDate"
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-64 h-11 px-3 border border-[#d8e0e8] rounded-md outline-none focus:border-[#087f83]"
          />

        </section>

        {/* Add reading section placeholder */}
        <section className="bg-white border border-[#d8e0e8] rounded-lg p-5 mb-6">

          <h3 className="text-lg font-semibold text-[#202b36] mb-2">
            Add glucose reading
          </h3>

                    <ReadingForm
            selectedDate={selectedDate}
            onReadingAdded={() => setRefreshKey((current) => current + 1)}
            />

            <DailyReadings
            selectedDate={selectedDate}
            refreshKey={refreshKey}
            />

        </section>

        {/* Reports placeholder */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {['Daily report', 'Month to date', 'Previous month'].map((title) => (
            <div
              key={title}
              className="bg-white border border-[#d8e0e8] rounded-lg p-5"
            >
              <h3 className="font-semibold text-[#202b36]">
                {title}
              </h3>

              <p className="text-sm text-[#5c6b7c] mt-2">
                Report information will appear here.
              </p>
            </div>
          ))}

        </section>

      </div>
    </main>
  );
}

export default Dashboard;
