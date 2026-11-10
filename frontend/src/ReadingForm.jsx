
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

    if (!Number.isInteger(glucoseValue) ||
        glucoseValue < 40 ||
        glucoseValue > 600) {
      setError('Glucose value must be an integer between 40 and 600 mg/dL.');
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
    <section className="bg-white border border-[#d8e0e8] rounded-lg p-5">

      <h3 className="text-lg font-semibold text-[#202b36] mb-1">
        Add glucose reading
      </h3>

      <p className="text-sm text-[#5c6b7c] mb-5">
        Record your blood glucose level for the selected date.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
            {success}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Reading date
          </label>

          <input
            type="date"
            value={selectedDate}
            readOnly
            className="w-full h-11 px-3 border border-[#d8e0e8] rounded-md bg-gray-50 text-sm"
          />
        </div>

        <div>
          <label htmlFor="slot" className="block text-sm font-medium mb-1.5">
            Time slot
          </label>

          <select
            id="slot"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            required
            className="w-full h-11 px-3 border border-[#d8e0e8] rounded-md bg-white outline-none focus:border-[#087f83]"
          >
            <option value="">Select a time slot</option>

            {slots.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium mb-1.5">
            Glucose value (mg/dL)
          </label>

          <input
            id="value"
            type="number"
            min="40"
            max="600"
            step="1"
            placeholder="Enter value (40–600)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full h-11 px-3 border border-[#d8e0e8] rounded-md outline-none focus:border-[#087f83]"
          />

          <p className="text-xs text-[#5c6b7c] mt-1">
            Allowed range: 40–600 mg/dL
          </p>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full sm:w-auto px-6 h-11 bg-[#087f83] hover:bg-[#076e72] disabled:opacity-60 text-white font-semibold rounded-md"
        >
          {busy ? 'Saving...' : 'Save reading'}
        </button>

      </form>
    </section>
  );
}

export default ReadingForm;
