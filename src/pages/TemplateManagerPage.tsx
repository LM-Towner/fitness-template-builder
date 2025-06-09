import { TemplateManager } from '../components/TemplateManager';

export function TemplateManagerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workout Templates</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create and manage workout templates that you can use to quickly create new workouts.
        </p>
      </div>

      <TemplateManager />
    </div>
  );
} 