import { useWorkoutStore, type Workout } from '../store/workoutStore';
import { useNavigate } from 'react-router-dom';

export function WorkoutList() {
  const { workouts, deleteWorkout } = useWorkoutStore();
  const navigate = useNavigate();

  const handleStartWorkout = (workout: Workout) => {
    navigate(`/workout/${workout.id}`);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(workoutId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Workouts</h2>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{workout.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(workout.date).toLocaleDateString()} - {workout.dayOfWeek}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {workout.exercises.length} exercises
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStartWorkout(workout)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 