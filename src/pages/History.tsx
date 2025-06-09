import { useState } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { format } from 'date-fns';

export const History = () => {
  const { workouts, completeWorkout } = useWorkoutStore();
  const [completingWorkout, setCompletingWorkout] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const handleCompleteWorkout = async (id: string) => {
    setCompletingWorkout(id);
    try {
      await completeWorkout(id, duration);
    } catch (error) {
      console.error('Error completing workout:', error);
    } finally {
      setCompletingWorkout(null);
      setDuration(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workout History</h1>
      
      <div className="space-y-6">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{workout.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(new Date(workout.date), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {workout.completed ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                    Completed
                  </span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      placeholder="Duration (min)"
                      className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                      min="0"
                    />
                    <button
                      onClick={() => handleCompleteWorkout(workout.id)}
                      disabled={completingWorkout === workout.id}
                      className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {completingWorkout === workout.id ? 'Completing...' : 'Complete'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {workout.exercises.map((planned, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{planned.exercise.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sets:</span>
                        <span className="ml-2">{planned.sets}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Reps:</span>
                        <span className="ml-2">{planned.reps || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Weight:</span>
                        <span className="ml-2">
                          {planned.weight ? `${planned.weight} kg` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    {planned.notes && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {planned.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {workout.completed && workout.duration && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Duration: {workout.duration} minutes
              </div>
            )}
          </div>
        ))}

        {workouts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No workouts recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 