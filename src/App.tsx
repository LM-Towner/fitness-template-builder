import { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { BlockPalette } from './components/BlockPalette';
import { PlannerGrid } from './components/PlannerGrid';
import { DaySelector } from './components/DaySelector';
import { DAYS_OF_WEEK } from './utils/constants';
import type { DayOfWeek } from './utils/constants';
import type { WorkoutBlock, PlannerState } from './types/workout';
import { WORKOUT_BLOCKS } from './components/BlockPalette';

export default function App() {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([...DAYS_OF_WEEK]);
  const [blocks, setBlocks] = useState<PlannerState>(() => {
    const initialState: Record<DayOfWeek, WorkoutBlock[]> = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };
    return initialState;
  });
  const [activeBlock, setActiveBlock] = useState<WorkoutBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const block = WORKOUT_BLOCKS.find((b: WorkoutBlock) => b.id === active.id);
    if (block) {
      setActiveBlock(block);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveBlock(null);
      return;
    }

    const blockId = active.id as string;
    const targetDay = over.id as DayOfWeek;

    // Find the block in the palette
    const block = WORKOUT_BLOCKS.find((b: WorkoutBlock) => b.id === blockId);
    if (!block) {
      setActiveBlock(null);
      return;
    }

    // Add the block to the target day
    setBlocks(prev => ({
      ...prev,
      [targetDay]: [...prev[targetDay], block]
    }));
    setActiveBlock(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Workout Planner</h1>
          <p className="mt-1 text-sm text-gray-500">
            Drag and drop workout blocks to create your weekly schedule
          </p>
        </div>

        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {/* Day Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Visible Days</h3>
              <DaySelector
                selectedDays={selectedDays}
                onDayToggle={handleDayToggle}
              />
            </div>

            {/* Workout Blocks */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Workout Blocks</h3>
              <BlockPalette />
            </div>

            {/* Planner Grid */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Weekly Schedule</h3>
              <PlannerGrid
                selectedDays={selectedDays}
                blocks={blocks}
              />
            </div>
          </div>

          <DragOverlay>
            {activeBlock ? (
              <div className={`p-3 rounded-md border shadow-lg ${
                activeBlock.type === 'Cardio' ? 'bg-blue-50 border-blue-200' :
                activeBlock.type === 'Strength' ? 'bg-green-50 border-green-200' :
                activeBlock.type === 'Flexibility' ? 'bg-purple-50 border-purple-200' :
                'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    activeBlock.type === 'Cardio' ? 'bg-blue-100' :
                    activeBlock.type === 'Strength' ? 'bg-green-100' :
                    activeBlock.type === 'Flexibility' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <span className={`text-xs font-medium ${
                      activeBlock.type === 'Cardio' ? 'text-blue-600' :
                      activeBlock.type === 'Strength' ? 'text-green-600' :
                      activeBlock.type === 'Flexibility' ? 'text-purple-600' :
                      'text-orange-600'
                    }`}>
                      {activeBlock.type[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activeBlock.name}</p>
                    <p className="text-xs text-gray-500">{activeBlock.description}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
