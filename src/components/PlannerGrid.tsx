import { DAYS_OF_WEEK } from '../utils/constants';
import { DayColumn } from './DayColumn';

export function PlannerGrid() {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Weekly Schedule</h3>
              <p className="text-xs text-gray-500 mt-1">Drag and drop to organize your workouts</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              Clear All
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <DayColumn key={day} day={day} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 