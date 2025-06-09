import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientStore } from '../store/clientStore';
import { useWorkoutStore } from '../store/workoutStore';
import { format } from 'date-fns';
import { WorkoutHistory } from '../components/workout/WorkoutHistory';

export function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const { getClientById } = useClientStore();
  const { getWorkoutStats } = useWorkoutStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const client = id ? getClientById(id) : null;
  const stats = id ? getWorkoutStats(id) : null;

  useEffect(() => {
    setIsLoading(true);
    if (!id) {
      setError('No client ID provided');
      setIsLoading(false);
      return;
    }

    if (!client) {
      setError('Client not found');
    }
    setIsLoading(false);
  }, [id, client]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => navigate('/clients')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-600 dark:text-yellow-400">Client not found</p>
          <button
            onClick={() => navigate('/clients')}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
            <div className="mt-2 space-y-1">
              <p className="text-gray-500 dark:text-gray-400 break-all">
                <a href={`mailto:${client.email}`} className="hover:text-blue-500 transition-colors">
                  {client.email}
                </a>
              </p>
              {client.phone && (
                <p className="text-gray-500 dark:text-gray-400">
                  <a href={`tel:${client.phone}`} className="hover:text-blue-500 transition-colors">
                    {client.phone}
                  </a>
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {format(new Date(client.joinDate), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/workout-planner?clientId=${client.id}`)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Workout
            </button>
            <button
              onClick={() => navigate('/clients')}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Clients
            </button>
          </div>
        </div>

        {/* Client Goals */}
        {client.goals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Goals</h2>
            <div className="flex flex-wrap gap-2">
              {client.goals.map((goal, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Client Notes */}
        {client.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes</h2>
            <p className="text-gray-600 dark:text-gray-400">{client.notes}</p>
          </div>
        )}

        {/* Progress Section */}
        {client.progress && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {client.progress.weight && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{client.progress.weight} kg</p>
                </div>
              )}
              {client.progress.bodyFat && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Body Fat</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{client.progress.bodyFat}%</p>
                </div>
              )}
              {client.progress.measurements && (
                <>
                  {client.progress.measurements.chest && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Chest</h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{client.progress.measurements.chest} cm</p>
                    </div>
                  )}
                  {client.progress.measurements.waist && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Waist</h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{client.progress.measurements.waist} cm</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {format(new Date(client.progress.lastUpdated), 'MMMM d, yyyy')}
            </p>
          </div>
        )}

        {/* Workout Stats */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Workout Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Workouts</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWorkouts}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Workouts</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedWorkouts}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Exercises</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalExercises}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Exercises/Workout</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageExercisesPerWorkout.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Workout History */}
        {id && <WorkoutHistory clientId={id} />}
      </div>
    </div>
  );
} 