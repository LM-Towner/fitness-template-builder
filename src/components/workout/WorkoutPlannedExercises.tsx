import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { PlannedExercise } from '../../hooks/useExercises';

interface WorkoutPlannedExercisesProps {
  exercises: PlannedExercise[];
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (index: number, updates: Partial<PlannedExercise>) => void;
  onReorderExercises: (startIndex: number, endIndex: number) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function WorkoutPlannedExercises({
  exercises,
  onRemoveExercise,
  onUpdateExercise,
  onReorderExercises,
  onSave,
  isSaving,
}: WorkoutPlannedExercisesProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderExercises(result.source.index, result.destination.index);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Planned Exercises</h2>
        <button
          onClick={onSave}
          disabled={isSaving || exercises.length === 0}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
            isSaving || exercises.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            'Save Workout'
          )}
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="planned-exercises">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {exercises.map((plannedExercise, index) => (
                <Draggable
                  key={`${plannedExercise.exercise.id}-${index}`}
                  draggableId={`${plannedExercise.exercise.id}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {plannedExercise.exercise.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {plannedExercise.exercise.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveExercise(index)}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Sets</label>
                          <input
                            type="number"
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            value={plannedExercise.sets}
                            onChange={(e) => onUpdateExercise(index, { sets: parseInt(e.target.value) })}
                          />
                        </div>

                        {plannedExercise.exercise.type === 'strength' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Reps</label>
                              <input
                                type="number"
                                min="1"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={plannedExercise.reps}
                                onChange={(e) => onUpdateExercise(index, { reps: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Weight (kg)</label>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={plannedExercise.weight}
                                onChange={(e) => onUpdateExercise(index, { weight: parseFloat(e.target.value) })}
                              />
                            </div>
                          </>
                        )}

                        {plannedExercise.exercise.type === 'cardio' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Duration (min)</label>
                              <input
                                type="number"
                                min="1"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={plannedExercise.duration}
                                onChange={(e) => onUpdateExercise(index, { duration: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Distance (km)</label>
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={plannedExercise.distance}
                                onChange={(e) => onUpdateExercise(index, { distance: parseFloat(e.target.value) })}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {exercises.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No exercises added</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add exercises from the library to create your workout
          </p>
        </div>
      )}
    </div>
  );
} 