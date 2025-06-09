import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClientStore } from '../store/clientStore';
import { WorkoutHistory } from '../components/workout/WorkoutHistory';
import WorkoutPlanner from './WorkoutPlanner';

export function ClientDashboard() {
  const { clientId } = useParams<{ clientId: string }>();
  const { getClientById } = useClientStore();
  const [activeTab, setActiveTab] = useState<'workouts' | 'history'>('workouts');

  if (!clientId) {
    return <div>Client not found</div>;
  }

  const client = getClientById(clientId);

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {client.name}'s Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage workouts and track progress
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`${
              activeTab === 'workouts'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            History & Progress
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'workouts' ? (
        <WorkoutPlanner />
      ) : (
        <WorkoutHistory clientId={clientId} />
      )}
    </div>
  );
} 