import type { DayOfWeek, Client, WorkoutTemplate } from '../../stores/workoutStore';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

interface WorkoutHeaderProps {
  workoutName: string;
  selectedClient: Client | null;
  selectedDay: DayOfWeek;
  selectedTemplate: WorkoutTemplate | null;
  clients: Client[];
  templates: WorkoutTemplate[];
  onWorkoutNameChange: (name: string) => void;
  onClientChange: (client: Client | null) => void;
  onDayChange: (day: DayOfWeek) => void;
  onTemplateChange: (template: WorkoutTemplate | null) => void;
}

export function WorkoutHeader({
  workoutName,
  selectedClient,
  selectedDay,
  selectedTemplate,
  clients,
  templates,
  onWorkoutNameChange,
  onClientChange,
  onDayChange,
  onTemplateChange,
}: WorkoutHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Workout</h1>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Client
          </label>
          <select
            id="client"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = clients.find((c) => c.id === e.target.value);
              onClientChange(client || null);
            }}
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Use Template (Optional)
          </label>
          <select
            id="template"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={selectedTemplate?.id || ''}
            onChange={(e) => {
              const template = templates.find((t) => t.id === e.target.value);
              onTemplateChange(template || null);
            }}
          >
            <option value="">Select a template (optional)</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workout Name
          </label>
          <input
            type="text"
            id="workout-name"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={workoutName}
            onChange={(e) => onWorkoutNameChange(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="day-of-week" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Day of Week
          </label>
          <select
            id="day-of-week"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value as DayOfWeek)}
            required
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 