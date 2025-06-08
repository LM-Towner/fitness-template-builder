import { DAYS_OF_WEEK } from '../utils/constants';
import type { DayOfWeek } from '../utils/constants';
import { DayColumn } from './DayColumn';
import type { WorkoutBlock } from '../types/workout';

interface PlannerGridProps {
  selectedDays: DayOfWeek[];
  blocks: Record<DayOfWeek, WorkoutBlock[]>;
}

export function PlannerGrid({ selectedDays, blocks }: PlannerGridProps) {
  const visibleDays = DAYS_OF_WEEK.filter(day => selectedDays.includes(day));

  if (visibleDays.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Select days to display in the planner</p>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {visibleDays.map((day) => (
        <DayColumn key={day} day={day} blocks={blocks[day]} />
      ))}
    </div>
  );
} 