import type { DayOfWeek } from '../../store/workoutStore';
import type { WorkoutTemplate } from '../../store/templateStore';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

interface TemplateFormProps {
  templateName: string;
  templateDescription: string;
  selectedDay: DayOfWeek | '';
  isPublic: boolean;
  editingTemplate: WorkoutTemplate | null;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onDayChange: (day: DayOfWeek | '') => void;
  onPublicChange: (isPublic: boolean) => void;
}

export function TemplateForm({
  templateName,
  templateDescription,
  selectedDay,
  isPublic,
  editingTemplate,
  onNameChange,
  onDescriptionChange,
  onDayChange,
  onPublicChange,
}: TemplateFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {editingTemplate ? 'Edit Template' : 'Create Template'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Template Name
          </label>
          <input
            type="text"
            id="template-name"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={templateName}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="template-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="template-description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={templateDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="day-of-week" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Day of Week (Optional)
          </label>
          <select
            id="day-of-week"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value as DayOfWeek)}
          >
            <option value="">Select a day</option>
            {DAYS_OF_WEEK.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is-public"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={isPublic}
            onChange={(e) => onPublicChange(e.target.checked)}
          />
          <label htmlFor="is-public" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Make this template public
          </label>
        </div>
      </div>
    </div>
  );
} 