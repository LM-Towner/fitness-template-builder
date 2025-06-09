import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../store/clientStore';
import { WORKOUT_LIBRARY } from '../utils/workoutLibrary';

interface TemplateExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  exercises: TemplateExercise[];
}

const Templates = () => {
  const navigate = useNavigate();
  const { clients } = useClientStore();
  const [selectedClient, setSelectedClient] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<Template, 'id'>>({
    name: '',
    description: '',
    exercises: []
  });
  const [customExercises, setCustomExercises] = useState<TemplateExercise[]>([]);

  useEffect(() => {
    try {
      if (clients && clients.length > 0) {
        setSelectedClient(clients[0].id);
      }
      setIsInitialized(true);
    } catch (err) {
      console.error('Error initializing Templates:', err);
      setError('Failed to initialize templates. Please refresh the page.');
    }
  }, [clients]);

  const handleUseTemplate = (template: Template) => {
    try {
      if (!selectedClient) {
        setError('Please select a client first');
        return;
      }

      navigate('/workout-planner', {
        state: {
          template,
          clientId: selectedClient
        }
      });
    } catch (err) {
      console.error('Error using template:', err);
      setError('Failed to use template. Please try again.');
    }
  };

  const handleAddExercise = () => {
    setCustomExercises([
      ...customExercises,
      { name: '', sets: 3, reps: 10 }
    ]);
  };

  const handleUpdateExercise = (index: number, field: keyof TemplateExercise, value: string | number) => {
    const updatedExercises = [...customExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setCustomExercises(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    setCustomExercises(customExercises.filter((_, i) => i !== index));
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      setError('Template name is required');
      return;
    }

    if (customExercises.length === 0) {
      setError('At least one exercise is required');
      return;
    }

    const template: Template = {
      id: crypto.randomUUID(),
      ...newTemplate,
      exercises: customExercises
    };

    // Here you would typically save the template to your store
    // For now, we'll just use it directly
    handleUseTemplate(template);
    setShowCreateModal(false);
  };

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workout Templates</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Template
        </button>
      </div>
      
      <div className="mb-6">
        <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Client
        </label>
        <select
          id="client"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(WORKOUT_LIBRARY).map(([key, exercises]) => {
          const template: Template = {
            id: key,
            name: key.charAt(0).toUpperCase() + key.slice(1) + ' Workout',
            description: `A comprehensive ${key} workout targeting all major muscle groups.`,
            exercises: exercises.map(ex => ({
              name: ex.name,
              sets: ex.sets,
              reps: typeof ex.reps === 'string' ? parseInt(ex.reps) : ex.reps,
              weight: ex.weight === null ? undefined : ex.weight
            }))
          };
          
          return (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-4">{template.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>
              <div className="space-y-2 mb-4">
                {template.exercises.map((exercise: TemplateExercise, index: number) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mr-2">
                      {index + 1}
                    </span>
                    {exercise.name} - {exercise.sets} sets × {exercise.reps} reps
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use Template
              </button>
            </div>
          );
        })}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Template</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="e.g., Full Body Strength"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  placeholder="Describe the workout template..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Exercises
                </label>
                <div className="space-y-4">
                  {customExercises.map((exercise, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleUpdateExercise(index, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          placeholder="Exercise name"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleUpdateExercise(index, 'sets', parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          placeholder="Sets"
                          min="1"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => handleUpdateExercise(index, 'reps', parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          placeholder="Reps"
                          min="1"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveExercise(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddExercise}
                    className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    + Add Exercise
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates; 