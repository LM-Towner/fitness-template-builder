import type { DayOfWeek } from '../utils/constants';

interface DayColumnProps {
  day: DayOfWeek;
}

export function DayColumn({ day }: DayColumnProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{day}</h3>
      </div>
      <div className="flex-1 p-3">
        <div className="h-full min-h-[150px] bg-gray-50 rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-xs text-gray-500">Drop workout here</p>
          </div>
        </div>
      </div>
    </div>
  );
} 