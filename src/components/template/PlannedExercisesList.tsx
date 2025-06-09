import type { PlannedExercise } from '../../hooks/useExercises';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

interface PlannedExercisesListProps {
  exercises: PlannedExercise[];
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (index: number, updates: Partial<PlannedExercise>) => void;
  onReorderExercises: (startIndex: number, endIndex: number) => void;
}

export function PlannedExercisesList({
  exercises,
  onRemoveExercise,
  onUpdateExercise,
  onReorderExercises,
}: PlannedExercisesListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderExercises(result.source.index, result.destination.index);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Planned Exercises</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="exercises">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {exercises.map((plannedExercise, index) => (
                <Draggable
                  key={index}
                  draggableId={`exercise-${index}`}
                  index={index}
                >
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            ⋮⋮
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {plannedExercise.exercise.name}
                          </h3>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            onClick={() => {
                              const newExercise = { ...plannedExercise };
                              onUpdateExercise(exercises.length, newExercise);
                            }}
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            onClick={() => onRemoveExercise(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400">Sets</label>
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
                              <label className="block text-xs text-gray-500 dark:text-gray-400">Reps</label>
                              <input
                                type="number"
                                min="1"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={plannedExercise.reps}
                                onChange={(e) => onUpdateExercise(index, { reps: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400">Weight (kg)</label>
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
                              <label className="block text-xs text-gray-500 dark:text-gray-400">Duration (min)</label>
                              <input
                                type="number"
                                min="1"
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={plannedExercise.duration}
                                onChange={(e) => onUpdateExercise(index, { duration: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400">Distance (km)</label>
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

                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 dark:text-gray-400">Notes</label>
                        <textarea
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                          value={plannedExercise.notes}
                          onChange={(e) => onUpdateExercise(index, { notes: e.target.value })}
                          placeholder="Add any notes or instructions..."
                        />
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
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No exercises added yet. Select exercises from the list to add them to your template.
        </p>
      )}
    </div>
  );
} 