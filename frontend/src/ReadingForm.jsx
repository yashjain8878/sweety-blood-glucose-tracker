
import { useState } from 'react';
import { apiRequest } from './api.jsx';

const slots = [
  'Morning',
  'After breakfast',
  'After lunch',
  'After dinner'
];

function ReadingForm({ selectedDate, onReadingAdded }) {
  const [slot, setSlot] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!slot || value === '') {
      setError('Please enter all required fields.');
      return;
    }

    const glucoseValue = Number(value);

    if (
      !Number.isInteger(glucoseValue) ||
      glucoseValue < 40 ||
      glucoseValue > 600
    ) {
      setError(
        'Glucose value must be an integer between 40 and 600 mg/dL.'
      );
      return;
    }

    try {
      setBusy(true);

      const data = await apiRequest('/readings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reading_date: selectedDate,
          slot,
          value: glucoseValue
        })
      });

      setSuccess('Glucose reading added successfully!');
      setSlot('');
      setValue('');

      if (onReadingAdded) {
        onReadingAdded(data.reading);
      }

    } catch (err) {
      setError(err.message || 'Unable to add reading.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white border border-[#e0e9eb] rounded-2xl p-5 sm:p-7 shadow-sm">

      {/* Heading */}
      <div className="flex items-start gap-3 mb-7">
        <div className="w-12 h-12 shrink-0 bg-[#e7f5f3] rounded-xl flex items-center justify-center text-2xl">
          🩺
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#203438]">
            Add glucose reading
          </h3>

          <p className="text-sm text-[#829397] mt-1">
            Record your blood glucose level for the selected date.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="flex items-start gap-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-4"
          >
            <span className="font-bold">✓</span>
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Reading date */}
          <div>
            <label
              htmlFor="readingFormDate"
              className="block text-sm font-semibold text-[#344b50] mb-2"
            >
              Reading date
            </label>

            <input
              id="readingFormDate"
              type="date"
              value={selectedDate}
              readOnly
              className="w-full h-12 px-4 border border-[#dce7e8] rounded-xl bg-[#f5f8f8] text-[#62777c] text-sm cursor-not-allowed"
            />

            <p className="text-xs text-[#91a1a4] mt-2">
              Selected from the dashboard.
            </p>
          </div>

          {/* Time slot */}
          <div>
            <label
              htmlFor="slot"
              className="block text-sm font-semibold text-[#344b50] mb-2"
            >
              Time slot
            </label>

            <select
              id="slot"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              required
              className="w-full h-12 px-4 border border-[#dce7e8] rounded-xl bg-white text-[#344b50] outline-none focus:border-[#087f83] focus:ring-4 focus:ring-[#087f83]/10 transition-all"
            >
              <option value="">Select a time slot</option>

              {slots.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Glucose value */}
          <div className="md:col-span-2">
            <label
              htmlFor="value"
              className="block text-sm font-semibold text-[#344b50] mb-2"
            >
              Glucose value (mg/dL)
            </label>

            <input
              id="value"
              type="number"
              min="40"
              max="600"
              step="1"
              placeholder="Enter your glucose value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="w-full h-12 px-4 border border-[#dce7e8] rounded-xl bg-white text-[#263c40] placeholder:text-[#a2b1b4] outline-none focus:border-[#087f83] focus:ring-4 focus:ring-[#087f83]/10 transition-all"
            />

            <p className="text-xs text-[#829397] mt-2">
              Enter a whole number between 40 and 600 mg/dL.
            </p>
          </div>

        </div>

        {/* Submit button */}
        <div className="pt-2 border-t border-[#edf1f2]">
          <button
            type="submit"
            disabled={busy}
            className="w-full sm:w-auto min-w-48 h-12 px-7 bg-[#087f83] hover:bg-[#076e72] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md shadow-[#087f83]/15 transition-all"
          >
            {busy ? 'Saving reading...' : '＋ Save glucose reading'}
          </button>
        </div>

      </form>
    </section>
  );
}

export default ReadingForm;
