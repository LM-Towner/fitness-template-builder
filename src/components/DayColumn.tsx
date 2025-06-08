import { useDroppable } from '@dnd-kit/core';
import type { DayOfWeek } from '../utils/constants';
import type { WorkoutBlock } from '../types/workout';

interface DayColumnProps {
  day: DayOfWeek;
  blocks: WorkoutBlock[];
}

export function DayColumn({ day, blocks }: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day,
    data: {
      type: 'day-column',
      day
    }
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{day}</h3>
      </div>
      <div className="flex-1 p-3">
        <div
          ref={setNodeRef}
          className={`h-full min-h-[150px] rounded-md border-2 border-dashed transition-colors ${
            isOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          {blocks.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Drop workout here</p>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="p-2 bg-white rounded-md border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      block.type === 'Cardio' ? 'bg-blue-50' :
                      block.type === 'Strength' ? 'bg-green-50' :
                      block.type === 'Flexibility' ? 'bg-purple-50' :
                      'bg-orange-50'
                    }`}>
                      <span className={`text-xs font-medium ${
                        block.type === 'Cardio' ? 'text-blue-600' :
                        block.type === 'Strength' ? 'text-green-600' :
                        block.type === 'Flexibility' ? 'text-purple-600' :
                        'text-orange-600'
                      }`}>
                        {block.type[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{block.name}</p>
                      <p className="text-xs text-gray-500">{block.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 