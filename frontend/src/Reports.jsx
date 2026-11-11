
import { useEffect, useState } from 'react';
import { apiRequest } from './api.jsx';

const formatValue = (value) =>
  value === null || value === undefined ? '—' : value;

const ReportCard = ({ title, subtitle, icon, report }) => (
  <section className="bg-white border border-[#e0e9eb] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">

    {/* Card heading */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-xl bg-[#e8f5f3] flex items-center justify-center text-xl">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-[#203438]">
          {title}
        </h3>
        <p className="text-xs text-[#91a1a4] mt-1">
          {subtitle}
        </p>
      </div>
    </div>

    {report ? (
      <>
        {/* Summary statistics */}
        <div className="grid grid-cols-2 gap-3">

          <div className="bg-[#f8fafa] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <p className="text-xs font-medium text-[#829397]">
                Highest
              </p>
            </div>

            <p className="text-2xl font-bold text-[#263c40]">
              {formatValue(report.summary.highest)}
            </p>
            <p className="text-xs text-[#a0adaf] mt-1">mg/dL</p>
          </div>

          <div className="bg-[#f8fafa] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-xs font-medium text-[#829397]">
                Lowest
              </p>
            </div>

            <p className="text-2xl font-bold text-[#263c40]">
              {formatValue(report.summary.lowest)}
            </p>
            <p className="text-xs text-[#a0adaf] mt-1">mg/dL</p>
          </div>

          <div className="bg-[#eff8f6] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#087f83]" />
              <p className="text-xs font-medium text-[#668b89]">
                Average
              </p>
            </div>

            <p className="text-2xl font-bold text-[#087f83]">
              {formatValue(report.summary.average)}
            </p>
            <p className="text-xs text-[#829f9d] mt-1">mg/dL</p>
          </div>

          <div className="bg-[#f8fafa] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <p className="text-xs font-medium text-[#829397]">
                Total readings
              </p>
            </div>

            <p className="text-2xl font-bold text-[#263c40]">
              {report.summary.total}
            </p>
            <p className="text-xs text-[#a0adaf] mt-1">Recorded</p>
          </div>

        </div>

        {/* Reading details */}
        <div className="mt-6 pt-5 border-t border-[#edf1f2]">

          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-[#344b50]">
              Reading history
            </h4>

            <span className="text-xs text-[#829397]">
              {report.readings.length} entries
            </span>
          </div>

          {report.readings.length === 0 ? (
            <div className="bg-[#f8fafa] rounded-xl py-6 px-3 text-center">
              <p className="text-sm font-medium text-[#52676c]">
                No readings recorded
              </p>
              <p className="text-xs text-[#91a1a4] mt-1">
                Your readings will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">

              {report.readings.map((reading) => (
                <div
                  key={reading.id}
                  className="flex items-center justify-between gap-3 bg-[#f8fafa] rounded-xl p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#344b50] truncate">
                      {reading.slot}
                    </p>

                    <p className="text-xs text-[#91a1a4] mt-1">
                      {String(reading.reading_date).slice(0, 10)}
                    </p>
                  </div>

                  <div className="shrink-0 bg-[#e7f5f3] text-[#087f83] px-3 py-2 rounded-lg">
                    <p className="text-sm font-bold">
                      {reading.value}
                    </p>
                    <p className="text-[10px] font-medium text-center">
                      mg/dL
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </>
    ) : (
      <p className="text-sm text-[#829397]">
        No report available.
      </p>
    )}
  </section>
);

function Reports({ selectedDate }) {
  const [daily, setDaily] = useState(null);
  const [month, setMonth] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError('');

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };

      try {
        const [dailyData, monthData, previousData] =
          await Promise.all([
            apiRequest(`/reports/daily?date=${selectedDate}`, {
              headers
            }),
            apiRequest('/reports/month-to-date', { headers }),
            apiRequest('/reports/previous-month', { headers })
          ]);

        setDaily(dailyData);
        setMonth(monthData);
        setPrevious(previousData);
      } catch (err) {
        setError(err.message || 'Unable to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedDate]);

  if (loading) {
    return (
      <section className="mt-8">
        <p className="text-sm text-[#829397]">
          Loading your glucose reports...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
      >
        {error}
      </div>
    );
  }

  return (
    <section className="mt-8">

      {/* Reports heading */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wider text-[#087f83] mb-2">
          YOUR HEALTH INSIGHTS
        </p>

        <h2 className="text-2xl font-bold text-[#203438]">
          Glucose reports
        </h2>

        <p className="text-sm text-[#829397] mt-1">
          Review your glucose readings and track your recorded history.
        </p>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        <ReportCard
          title="Daily report"
          subtitle={`Selected date: ${selectedDate}`}
          icon="📅"
          report={daily}
        />

        <ReportCard
          title="Month to date"
          subtitle="Current month's overview"
          icon="📊"
          report={month}
        />

        <ReportCard
          title="Previous month"
          subtitle="Previous month's overview"
          icon="📈"
          report={previous}
        />

      </div>

    </section>
  );
}

export default Reports;
