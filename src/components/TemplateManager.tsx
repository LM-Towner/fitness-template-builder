import { useState } from 'react';
import { useTemplateStore, type WorkoutTemplate } from '../store/templateStore';
import type { PlannedExercise } from '../hooks/useExercises';
import type { DayOfWeek } from '../store/workoutStore';
import { TemplateForm } from './template/TemplateForm';
import { ExerciseSelector } from './template/ExerciseSelector';
import { PlannedExercisesList } from './template/PlannedExercisesList';
import { RecurringScheduleForm } from './template/RecurringScheduleForm';

export function TemplateManager() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, recurringSchedules, deleteRecurringSchedule } = useTemplateStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [plannedExercises, setPlannedExercises] = useState<PlannedExercise[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('');
  const [isPublic, setIsPublic] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [showRecurringSchedule, setShowRecurringSchedule] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');

  const handleAddExercise = (exercise: PlannedExercise['exercise']) => {
    const newExercise: PlannedExercise = {
      exercise,
      sets: exercise.defaultReps?.sets ?? 3,
      reps: exercise.defaultReps?.reps ?? 0,
      duration: exercise.defaultReps?.duration ?? 0,
      distance: exercise.defaultReps?.distance ?? 0,
      weight: exercise.type === 'strength' ? 0 : 0,
      notes: ''
    };
    setPlannedExercises(prev => [...prev, newExercise]);
  };

  const handleRemoveExercise = (index: number) => {
    setPlannedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index: number, updates: Partial<PlannedExercise>) => {
    setPlannedExercises(prev =>
      prev.map((exercise, i) =>
        i === index ? { ...exercise, ...updates } : exercise
      )
    );
  };

  const handleReorderExercises = (startIndex: number, endIndex: number) => {
    setPlannedExercises(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (plannedExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const templateData = {
      name: templateName,
      description: templateDescription,
      exercises: plannedExercises,
      dayOfWeek: selectedDay || undefined,
      isPublic
    };

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, templateData);
    } else {
      addTemplate(templateData);
    }

    // Reset form
    setTemplateName('');
    setTemplateDescription('');
    setPlannedExercises([]);
    setSelectedDay('');
    setIsPublic(false);
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setPlannedExercises(template.exercises);
    setSelectedDay(template.dayOfWeek || '');
    setIsPublic(template.isPublic);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(id);
    }
  };

  const handleDeleteRecurringSchedule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this recurring schedule?')) {
      deleteRecurringSchedule(id);
    }
  };

  return (
    <div className="space-y-6">
      <TemplateForm
        templateName={templateName}
        templateDescription={templateDescription}
        selectedDay={selectedDay}
        isPublic={isPublic}
        editingTemplate={editingTemplate}
        onNameChange={setTemplateName}
        onDescriptionChange={setTemplateDescription}
        onDayChange={setSelectedDay}
        onPublicChange={setIsPublic}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExerciseSelector
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onExerciseSelect={handleAddExercise}
        />

        <PlannedExercisesList
          exercises={plannedExercises}
          onRemoveExercise={handleRemoveExercise}
          onUpdateExercise={handleUpdateExercise}
          onReorderExercises={handleReorderExercises}
        />
      </div>

      <div className="flex justify-end space-x-4">
        {editingTemplate && (
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={() => {
              setEditingTemplate(null);
              setTemplateName('');
              setTemplateDescription('');
              setPlannedExercises([]);
              setSelectedDay('');
              setIsPublic(false);
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleSaveTemplate}
        >
          {editingTemplate ? 'Update Template' : 'Save Template'}
        </button>
      </div>

      {/* Template List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Templates</h2>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => setShowRecurringSchedule(true)}
          >
            Add Recurring Schedule
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  {template.dayOfWeek && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {template.dayOfWeek}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => handleEditTemplate(template)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {template.description && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
              )}
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {template.exercises.length} exercises
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recurring Schedules */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recurring Schedules</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recurringSchedules.map(schedule => {
            const template = templates.find(t => t.id === schedule.templateId);
            return (
              <div
                key={schedule.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {template?.name || 'Unknown Template'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {schedule.daysOfWeek.join(', ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => handleDeleteRecurringSchedule(schedule.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Start: {new Date(schedule.startDate).toLocaleDateString()}
                    {schedule.endDate && ` - End: ${new Date(schedule.endDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recurring Schedule Modal */}
      {showRecurringSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add Recurring Schedule
              </h3>
              <button
                onClick={() => setShowRecurringSchedule(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <RecurringScheduleForm
              clientId={selectedClientId}
              onSave={() => setShowRecurringSchedule(false)}
              onCancel={() => setShowRecurringSchedule(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 