import { DAYS_OF_WEEK } from '../utils/constants';

interface DaySelectorProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
}

export function DaySelector({ selectedDays, onDayToggle }: DaySelectorProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Visible Days</h3>
        <p className="text-xs text-gray-500 mt-1">Select which days to display</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map((day) => (
            <label
              key={day}
              className="relative flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
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
      </div>
    </div>
  );
} 