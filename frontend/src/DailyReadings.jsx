
import { useEffect, useState } from 'react';
import { apiRequest } from './api.jsx';

const slots = [
  'Morning',
  'After breakfast',
  'After lunch',
  'After dinner'
];

const slotIcons = {
  'Morning': '🌅',
  'After breakfast': '☀️',
  'After lunch': '🍽️',
  'After dinner': '🌙'
};

function DailyReadings({ selectedDate, refreshKey }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editSlot, setEditSlot] = useState('');
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

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
          (reading) =>
            String(reading.reading_date).slice(0, 10) === selectedDate
        );

        setReadings(dailyReadings);
      } catch (err) {
        setError(err.message || 'Unable to load readings.');
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [selectedDate, refreshKey, reloadKey]);

  const startEditing = (reading) => {
    setEditingId(reading.id);
    setEditDate(
      reading.reading_date
        ? String(reading.reading_date).slice(0, 10)
        : ''
    );
    setEditSlot(reading.slot);
    setEditValue(String(reading.value));
    setMessage('');
    setError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setMessage('');
  };

  const handleUpdate = async (id) => {
    const numericValue = Number(editValue);

    if (!editDate || !editSlot || !editValue.trim()) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (
      !Number.isInteger(numericValue) ||
      numericValue < 40 ||
      numericValue > 600
    ) {
      setMessage('Glucose value must be between 40 and 600.');
      return;
    }

    try {
      await apiRequest(`/readings/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reading_date: editDate,
          slot: editSlot,
          value: numericValue
        })
      });

      setEditingId(null);
      setMessage('Reading updated successfully!');
      setReloadKey((current) => current + 1);
    } catch (err) {
      setMessage(err.message || 'Unable to update reading.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this reading?'
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/readings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage('Reading deleted successfully!');
      setReloadKey((current) => current + 1);
    } catch (err) {
      setMessage(err.message || 'Unable to delete reading.');
    }
  };

  return (
    <section className="bg-white border border-[#e0e9eb] rounded-2xl p-5 sm:p-7 shadow-sm">

      {/* Section heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

        <div>
          <h3 className="text-xl font-bold text-[#203438]">
            Daily readings
          </h3>

          <p className="text-sm text-[#829397] mt-1">
            Your glucose readings for {selectedDate}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start bg-[#e7f5f3] text-[#087f83] px-3 py-2 rounded-lg text-xs font-semibold">
          <span>●</span>
          {readings.length} / 4 readings
        </div>

      </div>

      {/* Status message */}
      {message && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-[#cce9df] bg-[#effaf5] text-[#16734d] p-4 text-sm"
        >
          {message}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center">
          <p className="text-sm text-[#829397]">
            Loading your readings...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && readings.length === 0 && (
        <div className="bg-[#f5f9f9] border border-dashed border-[#d5e5e5] rounded-2xl py-12 px-5 text-center">

          <div className="w-16 h-16 mx-auto mb-4 bg-[#e5f3f2] rounded-2xl flex items-center justify-center text-3xl">
            🩺
          </div>

          <h4 className="text-lg font-bold text-[#263c40]">
            No readings yet
          </h4>

          <p className="text-sm text-[#829397] mt-2 max-w-sm mx-auto">
            You haven't recorded any glucose readings for this date. Add your first reading using the form above.
          </p>

        </div>
      )}

      {/* Reading cards */}
      {!loading && !error && readings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {slots.map((slot) => {
            const reading = readings.find(
              (item) => item.slot === slot
            );

            return (
              <div
                key={slot}
                className={`rounded-2xl border p-5 transition-all ${
                  reading
                    ? 'bg-white border-[#dce9e9] hover:border-[#9accca] hover:shadow-md'
                    : 'bg-[#f8fafa] border-[#e8eeee] border-dashed'
                }`}
              >

                {/* Slot heading */}
                <div className="flex items-center justify-between gap-2 mb-4">

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#e9f5f3] flex items-center justify-center text-xl">
                      {slotIcons[slot]}
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#263c40] text-sm">
                        {slot}
                      </h4>

                      <p className="text-xs text-[#91a1a4] mt-1">
                        {reading ? 'Reading recorded' : 'Not recorded'}
                      </p>
                    </div>
                  </div>

                  {reading && (
                    <span className="text-[#087f83] text-lg font-bold">
                      ✓
                    </span>
                  )}

                </div>

                {/* Existing reading */}
                {reading && editingId !== reading.id && (
                  <>
                    <div className="bg-[#f3f8f7] rounded-xl p-4 mb-4">
                      <p className="text-xs text-[#829397] mb-1">
                        Glucose level
                      </p>

                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-[#087f83]">
                          {reading.value}
                        </span>

                        <span className="text-sm text-[#829397] font-medium">
                          mg/dL
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() => startEditing(reading)}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-[#b9dddd] text-[#087f83] text-sm font-semibold hover:bg-[#eaf6f5] transition-colors"
                      >
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(reading.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-[#f0d0d0] text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>

                    </div>
                  </>
                )}

                {/* Empty slot */}
                {!reading && (
                  <div className="py-4 text-center">
                    <p className="text-sm text-[#a0adaf]">
                      No reading added
                    </p>
                  </div>
                )}

                {/* Edit form */}
                {reading && editingId === reading.id && (
                  <div className="space-y-4">

                    <div className="text-sm font-semibold text-[#087f83]">
                      Edit glucose reading
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#52676c] mb-2">
                        Reading date
                      </label>

                      <input
                        type="date"
                        value={editDate}
                        max={new Date().toLocaleDateString('en-CA')}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full h-11 px-3 border border-[#dce7e8] rounded-xl text-sm outline-none focus:border-[#087f83] focus:ring-4 focus:ring-[#087f83]/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#52676c] mb-2">
                        Time slot
                      </label>

                      <select
                        value={editSlot}
                        onChange={(e) => setEditSlot(e.target.value)}
                        className="w-full h-11 px-3 border border-[#dce7e8] rounded-xl text-sm bg-white outline-none focus:border-[#087f83]"
                      >
                        {slots.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#52676c] mb-2">
                        Glucose value (mg/dL)
                      </label>

                      <input
                        type="number"
                        min="40"
                        max="600"
                        step="1"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full h-11 px-3 border border-[#dce7e8] rounded-xl text-sm outline-none focus:border-[#087f83]"
                        placeholder="Glucose value"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">

                      <button
                        type="button"
                        onClick={() => handleUpdate(reading.id)}
                        className="flex-1 py-2.5 px-3 bg-[#087f83] hover:bg-[#076e72] text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        Save changes
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="flex-1 py-2.5 px-3 border border-[#dce7e8] text-[#52676c] text-sm font-semibold rounded-xl hover:bg-[#f5f8f8] transition-colors"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default DailyReadings;
