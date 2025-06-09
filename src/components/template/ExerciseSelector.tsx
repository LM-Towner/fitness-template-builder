import { useState } from 'react';
import { useExercises } from '../../hooks/useExercises';
import type { PlannedExercise } from '../../hooks/useExercises';
import { AddCustomExerciseModal } from '../exercise/AddCustomExerciseModal';

interface ExerciseSelectorProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onExerciseSelect: (exercise: PlannedExercise['exercise']) => void;
}

export function ExerciseSelector({
  selectedCategory,
  onCategoryChange,
  onExerciseSelect,
}: ExerciseSelectorProps) {
  const { categories, getExercisesByCategory } = useExercises();
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Select Exercises</h2>
        <button
          type="button"
          onClick={() => setIsAddExerciseModalOpen(true)}
          className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Custom Exercise
        </button>
      </div>
      
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Exercise Category
        </label>
        <select
          id="category"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {selectedCategory && getExercisesByCategory(selectedCategory).map(exercise => (
          <div
            key={exercise.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => onExerciseSelect(exercise)}
          >
            <span className="text-sm text-gray-900 dark:text-white">{exercise.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{exercise.type}</span>
          </div>
        ))}
      </div>

      <AddCustomExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
      />
    </div>
  );
} 