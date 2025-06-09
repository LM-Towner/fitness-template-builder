import { useState } from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '../store/calendarStore';
import { useTemplateStore } from '../store/templateStore';
import { useWorkoutStore } from '../store/workoutStore';
import type { PlannedExercise } from '../hooks/useExercises';

interface ScheduledWorkoutEditorProps {
  scheduleId: string;
  date: Date;
  onClose: () => void;
}

export function ScheduledWorkoutEditor({ scheduleId, date, onClose }: ScheduledWorkoutEditorProps) {
  const { getScheduledWorkout, updateScheduledWorkout } = useCalendarStore();
  const { templates } = useTemplateStore();
  const { addWorkout } = useWorkoutStore();
  
  const scheduledWorkout = getScheduledWorkout(scheduleId, date);
  const [selectedTemplate, setSelectedTemplate] = useState(scheduledWorkout?.templateId || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    setIsSaving(true);

    try {
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error('Template not found');
      }

      // Create a new workout from the template
      const newWorkout = {
        ...template,
        id: scheduledWorkout?.id || crypto.randomUUID(),
        date: format(date, 'yyyy-MM-dd'),
        exercises: template.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          weight: null,
          duration: null,
          distance: null,
          notes: ''
        }))
      };

      // Update the scheduled workout
      updateScheduledWorkout(scheduleId, date, newWorkout);
      onClose();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Edit Workout for {format(date, 'MMMM d, yyyy')}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Workout Template
            </label>
            <select
              id="template"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 