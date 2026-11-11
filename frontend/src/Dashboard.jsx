
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadingForm from './ReadingForm.jsx';
import DailyReadings from './DailyReadings.jsx';
import Reports from './Reports.jsx';

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
    <main className="min-h-screen bg-[#f3f7f8]">

      {/* Navigation */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#e1e9eb] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#e5f5f3] rounded-xl flex items-center justify-center">
              <span className="text-2xl text-[#087f83]">♥</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#087f83]">
                Sweety
              </h1>
              <p className="text-[11px] text-[#829397] -mt-1">
                Glucose Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#e5f5f3] flex items-center justify-center text-[#087f83] font-bold">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#263c40]">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-[#829397]">
                  Personal account
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 text-sm font-semibold text-[#087f83] border border-[#cce5e3] rounded-xl hover:bg-[#eaf6f5] transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Welcome section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-[#087f83] mb-2">
                YOUR HEALTH OVERVIEW
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#203438]">
                Welcome back, {user.name || 'User'}!
              </h2>

              <p className="text-[#75888d] mt-2 text-sm sm:text-base">
                Keep track of your glucose readings and monitor your progress.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#087f83] bg-[#e7f5f3] px-4 py-3 rounded-xl">
              <span className="text-lg">♥</span>
              <span className="font-medium">Your health matters</span>
            </div>

          </div>
        </section>

        {/* Date selection */}
        <section className="bg-white border border-[#e0e9eb] rounded-2xl p-5 sm:p-6 mb-7 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#e8f5f4] flex items-center justify-center text-xl">
                📅
              </div>

              <div>
                <h3 className="font-semibold text-[#263c40]">
                  Select reading date
                </h3>
                <p className="text-xs sm:text-sm text-[#829397] mt-1">
                  Choose a date to view or add readings.
                </p>
              </div>
            </div>

            <input
              id="readingDate"
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-64 h-12 px-4 border border-[#dce7e8] rounded-xl bg-[#f9fbfb] text-[#263c40] outline-none focus:border-[#087f83] focus:ring-4 focus:ring-[#087f83]/10 transition-all"
            />

          </div>
        </section>

        {/* Reading form */}
        <section className="mb-7">
          <ReadingForm
            selectedDate={selectedDate}
            onReadingAdded={() => setRefreshKey((current) => current + 1)}
          />
        </section>

        {/* Daily readings */}
        <section className="mb-7">
          <DailyReadings
            selectedDate={selectedDate}
            refreshKey={refreshKey}
          />
        </section>

        {/* Reports */}
        <section className="pb-8">
          <Reports selectedDate={selectedDate} />
        </section>

        {/* Footer */}
        <footer className="border-t border-[#e0e9eb] pt-6 text-center">
          <p className="text-xs text-[#91a1a4]">
            Sweety · Your personal glucose companion
          </p>
        </footer>

      </div>
    </main>
  );
}

export default Dashboard;
