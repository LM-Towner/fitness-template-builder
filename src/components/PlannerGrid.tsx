import { DAYS_OF_WEEK } from '../utils/constants';
import { DayColumn } from './DayColumn';

interface PlannerGridProps {
  selectedDays: string[];
}

export function PlannerGrid({ selectedDays }: PlannerGridProps) {
  const visibleDays = DAYS_OF_WEEK.filter(day => selectedDays.includes(day));

  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Weekly Schedule</h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedDays.length === 0 
                  ? 'Select days to display'
                  : `Showing ${selectedDays.length} day${selectedDays.length === 1 ? '' : 's'}`
                }
              </p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              Clear All
            </button>
          </div>
        </div>
        <div className="p-4">
          {selectedDays.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Select days to display your schedule</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {visibleDays.map((day) => (
                <DayColumn key={day} day={day} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 