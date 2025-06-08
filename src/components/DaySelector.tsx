import { DAYS_OF_WEEK } from '../utils/constants';
import type { DayOfWeek } from '../utils/constants';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onDayToggle: (day: DayOfWeek) => void;
}

export function DaySelector({ selectedDays, onDayToggle }: DaySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DAYS_OF_WEEK.map((day) => (
        <label
          key={day}
          className="relative flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-200"
        >
          <input
            type="checkbox"
            checked={selectedDays.includes(day)}
            onChange={() => onDayToggle(day)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{day}</span>
        </label>
      ))}
    </div>
  );
} 