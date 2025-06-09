import { useState } from 'react';
import { useExerciseStore } from '../../store/exerciseStore';
import type { ExerciseType } from '../../hooks/useExercises';

interface CustomExerciseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CustomExerciseForm({ onSuccess, onCancel }: CustomExerciseFormProps) {
  const { addCustomExercise } = useExerciseStore();
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    type: 'strength' as ExerciseType,
    categoryId: '1',
    defaultReps: {
      sets: 3,
      reps: 10,
      duration: 0,
      distance: 0
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!exercise.name.trim()) {
      setError('Please enter an exercise name');
      return;
    }

    if (!exercise.description.trim()) {
      setError('Please enter an exercise description');
      return;
    }

    try {
      addCustomExercise(exercise);
      onSuccess?.();
    } catch {
      setError('Failed to add exercise. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Exercise Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={exercise.name}
          onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Enter exercise name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={exercise.description}
          onChange={(e) => setExercise({ ...exercise, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Enter exercise description"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Exercise Type
        </label>
        <select
          id="type"
          value={exercise.type}
          onChange={(e) => setExercise({ ...exercise, type: e.target.value as ExerciseType })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
          <option value="flexibility">Flexibility</option>
        </select>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="categoryId"
          value={exercise.categoryId}
          onChange={(e) => setExercise({ ...exercise, categoryId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="1">Upper Body</option>
          <option value="2">Lower Body</option>
          <option value="3">Core</option>
          <option value="4">Cardio</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sets" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Sets
          </label>
          <input
            type="number"
            id="sets"
            min="1"
            value={exercise.defaultReps.sets}
            onChange={(e) => setExercise({
              ...exercise,
              defaultReps: { ...exercise.defaultReps, sets: parseInt(e.target.value) }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        {exercise.type === 'strength' && (
          <div>
            <label htmlFor="reps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Default Reps
            </label>
            <input
              type="number"
              id="reps"
              min="1"
              value={exercise.defaultReps.reps}
              onChange={(e) => setExercise({
                ...exercise,
                defaultReps: { ...exercise.defaultReps, reps: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        )}

        {exercise.type === 'cardio' && (
          <>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Duration (min)
              </label>
              <input
                type="number"
                id="duration"
                min="1"
                value={exercise.defaultReps.duration}
                onChange={(e) => setExercise({
                  ...exercise,
                  defaultReps: { ...exercise.defaultReps, duration: parseInt(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Distance (km)
              </label>
              <input
                type="number"
                id="distance"
                min="0"
                step="0.1"
                value={exercise.defaultReps.distance}
                onChange={(e) => setExercise({
                  ...exercise,
                  defaultReps: { ...exercise.defaultReps, distance: parseFloat(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Exercise
        </button>
      </div>
    </form>
  );
} 