import { useState } from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '../store/calendarStore';
import { useClientStore } from '../store/clientStore';
import type { DayOfWeek } from '../store/workoutStore';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

interface RecurringScheduleFormProps {
  onSave?: () => void;
}

export function RecurringScheduleForm({ onSave }: RecurringScheduleFormProps) {
  const { addRecurringSchedule } = useCalendarStore();
  const { clients } = useClientStore();
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }

    setIsSaving(true);

    try {
      addRecurringSchedule({
        clientId: selectedClient,
        templateId: '', // Empty template ID since we're not using templates
        daysOfWeek: selectedDays,
        startDate,
        endDate: endDate || undefined,
        active: true
      });

      // Reset form
      setSelectedClient('');
      setSelectedDays([]);
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate('');

      onSave?.();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Client
        </label>
        <select
          id="client"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          required
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Days of Week
        </label>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                selectedDays.includes(day)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
              onClick={() => handleDayToggle(day)}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date (Optional)
          </label>
          <input
            type="date"
            id="end-date"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>
    </form>
  );
} 