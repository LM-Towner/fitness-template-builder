import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExercises } from '../hooks/useExercises';
import { useClientStore } from '../store/clientStore';
import { exportToGoogleSheets } from '../services/googleSheets';
import { exportToCSV, exportToPDF, exportToExcel } from '../utils/exportUtils';

export const ClientWorkoutPlanner = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { clients, addWorkoutToClient } = useClientStore();
  const { exercises, loading: exercisesLoading } = useExercises();
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Array<{
    exercise: typeof exercises[0];
    sets: number;
    reps?: number;
    weight?: number;
    notes?: string;
  }>>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const client = clients.find(c => c.id === clientId);

  useEffect(() => {
    if (!client) {
      navigate('/clients');
    }
  }, [client, navigate]);

  if (!client) {
    return null;
  }

  const handleAddExercise = (exercise: typeof exercises[0]) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exercise,
        sets: 3,
        reps: 10
      }
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: string, value: string | number) => {
    setSelectedExercises(selectedExercises.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString(),
      exercises: selectedExercises,
      completed: false
    };

    addWorkoutToClient(clientId!, newWorkout);
    navigate(`/clients/${clientId}/workouts`);
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'excel' | 'google') => {
    setIsExporting(true);
    setExportError(null);

    try {
      const currentWorkout = {
        id: Date.now().toString(),
        name: workoutName,
        date: new Date().toISOString(),
        exercises: selectedExercises,
        completed: false
      };

      const workoutsToExport = [...client.workouts, currentWorkout];

      switch (format) {
        case 'csv':
          exportToCSV(workoutsToExport);
          break;
        case 'pdf':
          exportToPDF(workoutsToExport);
          break;
        case 'excel':
          exportToExcel(workoutsToExport);
          break;
        case 'google':
          const result = await exportToGoogleSheets(currentWorkout);
          if (result.success) {
            window.open(result.url, '_blank');
          }
          break;
      }
    } catch (error) {
      setExportError('Failed to export. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
      setShowExportOptions(false);
    }
  };

  if (exercisesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Create Workout for {client.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Design a personalized workout plan for your client
            </p>
          </div>
          <button
            onClick={() => navigate(`/clients/${clientId}/workouts`)}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Back to Workouts
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter workout name"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Exercises</h2>
            <div className="space-y-4">
              {selectedExercises.map((ex, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{ex.exercise.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400">Sets</label>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400">Reps</label>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400">Weight (kg)</label>
                        <input
                          type="number"
                          value={ex.weight}
                          onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 dark:text-gray-400">Notes</label>
                      <input
                        type="text"
                        value={ex.notes}
                        onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="Add notes (optional)"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Exercise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleAddExercise(exercise)}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.category}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSaveWorkout}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Save Workout
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={isExporting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
              
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('csv')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as Excel
                    </button>
                    <button
                      onClick={() => handleExport('google')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export to Google Sheets
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {exportError && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
              {exportError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 