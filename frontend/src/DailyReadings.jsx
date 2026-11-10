
import { useEffect, useState } from 'react';
import { apiRequest } from './api.jsx';

function DailyReadings({ selectedDate, refreshKey }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReadings = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await apiRequest('/readings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const dailyReadings = data.readings.filter(
          (reading) => reading.reading_date.slice(0, 10) === selectedDate
        );

        setReadings(dailyReadings);
      } catch (err) {
        setError(err.message || 'Unable to load readings.');
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [selectedDate, refreshKey]);

  const slots = [
    'Morning',
    'After breakfast',
    'After lunch',
    'After dinner'
  ];

  return (
    <section className="bg-white border border-[#d8e0e8] rounded-lg p-5 mt-6">

      <h3 className="text-lg font-semibold text-[#202b36]">
        Daily readings
      </h3>

      <p className="text-sm text-[#5c6b7c] mt-1 mb-5">
        Your glucose readings for {selectedDate}.
      </p>

      {loading && (
        <p className="text-sm text-[#5c6b7c]">
          Loading readings...
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && readings.length === 0 && (
        <div className="bg-[#f3f6f8] rounded-md p-6 text-center">
          <p className="font-medium text-[#202b36]">
            No readings yet
          </p>

          <p className="text-sm text-[#5c6b7c] mt-1">
            Add your first glucose reading for this day.
          </p>
        </div>
      )}

      {!loading && !error && readings.length > 0 && (
        <div className="space-y-3">
          {slots.map((slot) => {
            const reading = readings.find(
              (item) => item.slot === slot
            );

            return (
              <div
                key={slot}
                className="flex items-center justify-between border-b border-[#e5eaf0] pb-3 last:border-0"
              >
                <span className="text-sm font-medium text-[#202b36]">
                  {slot}
                </span>

                <span className="text-sm font-semibold text-[#087f83]">
                  {reading ? `${reading.value} mg/dL` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}

export default DailyReadings;
