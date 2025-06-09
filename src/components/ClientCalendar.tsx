import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useWorkoutStore } from '../store/workoutStore';
import { useClientStore } from '../store/clientStore';
import { categories } from '../hooks/useExercises';
import type { Exercise, ExerciseCategory } from '../hooks/useExercises';

interface ClientCalendarProps {
  selectedClientId: string;
}

export function ClientCalendar({ selectedClientId }: ClientCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const { clients } = useClientStore();
  const { addWorkout } = useWorkoutStore();

  const [exerciseName, setExerciseName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number>(categories[0].id);
  const [exerciseDescription, setExerciseDescription] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowExerciseModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedClientId || !exerciseName) return;

    const exercise: Exercise = {
      id: Math.floor(Math.random() * 1000),
      name: exerciseName,
      type: 'strength',
      category: selectedCategory,
      description: exerciseDescription,
    };

    const newWorkout = {
      id: crypto.randomUUID(),
      clientId: selectedClientId,
      name: `Workout - ${exerciseName}`,
      date: selectedDate.toISOString(),
      exercises: [{
        exercise,
        sets: parseInt(sets) || 0,
        reps: parseInt(reps) || 0,
        weight: parseFloat(weight) || 0,
        notes: notes,
        completedSets: [],
      }],
      completed: false,
      notes: notes,
    };

    addWorkout(newWorkout);
    setShowExerciseModal(false);
    resetForm();
  };

  const resetForm = () => {
    setExerciseName('');
    setSelectedCategory(categories[0].id);
    setExerciseDescription('');
    setSets('');
    setReps('');
    setWeight('');
    setNotes('');
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {selectedClient?.name}'s Calendar - {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => handleDateClick(day)}
            className={`
              p-2 h-24 text-left rounded-lg border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
              ${!isSameMonth(day, currentDate) ? 'text-gray-400 dark:text-gray-600' : ''}
              ${isToday(day) ? 'border-primary dark:border-primary' : ''}
            `}
          >
            <span className="text-sm font-medium">{format(day, 'd')}</span>
          </button>
        ))}
      </div>

      {showExerciseModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Exercise for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setShowExerciseModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exercise Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  required
                >
                  {categories.map((category: ExerciseCategory) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exercise Name
                </label>
                <input
                  type="text"
                  id="exercise"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Enter exercise name"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exercise Description
                </label>
                <textarea
                  id="description"
                  value={exerciseDescription}
                  onChange={(e) => setExerciseDescription(e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Describe the exercise..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="sets" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sets
                  </label>
                  <input
                    type="number"
                    id="sets"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reps
                  </label>
                  <input
                    type="number"
                    id="reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    min="0"
                    step="0.5"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Add any notes about the exercise..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowExerciseModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 