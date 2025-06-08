import { useDraggable } from '@dnd-kit/core';
import type { WorkoutBlock } from '../types/workout';

export const WORKOUT_BLOCKS: WorkoutBlock[] = [
  {
    id: 'cardio-1',
    type: 'Cardio',
    name: 'Running',
    description: '30 minutes moderate pace'
  },
  {
    id: 'cardio-2',
    type: 'Cardio',
    name: 'Cycling',
    description: '45 minutes interval training'
  },
  {
    id: 'strength-1',
    type: 'Strength',
    name: 'Upper Body',
    description: 'Push-ups, pull-ups, dips'
  },
  {
    id: 'strength-2',
    type: 'Strength',
    name: 'Lower Body',
    description: 'Squats, lunges, deadlifts'
  },
  {
    id: 'flexibility-1',
    type: 'Flexibility',
    name: 'Yoga',
    description: '30 minutes flow'
  },
  {
    id: 'flexibility-2',
    type: 'Flexibility',
    name: 'Stretching',
    description: '15 minutes dynamic stretches'
  },
  {
    id: 'recovery-1',
    type: 'Recovery',
    name: 'Rest Day',
    description: 'Active recovery or complete rest'
  }
];

function DraggableBlock({ block }: { block: WorkoutBlock }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
    data: {
      type: 'workout-block',
      block
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-2 rounded-md border cursor-move transition-all ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      } ${
        block.type === 'Cardio' ? 'bg-blue-50 border-blue-200' :
        block.type === 'Strength' ? 'bg-green-50 border-green-200' :
        block.type === 'Flexibility' ? 'bg-purple-50 border-purple-200' :
        'bg-orange-50 border-orange-200'
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-5 h-5 rounded flex items-center justify-center ${
          block.type === 'Cardio' ? 'bg-blue-100' :
          block.type === 'Strength' ? 'bg-green-100' :
          block.type === 'Flexibility' ? 'bg-purple-100' :
          'bg-orange-100'
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
  );
}

export function BlockPalette() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {WORKOUT_BLOCKS.map((block) => (
        <DraggableBlock key={block.id} block={block} />
      ))}
    </div>
  );
} 