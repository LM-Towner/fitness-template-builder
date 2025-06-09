import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../store/clientStore';
import { Plus } from 'lucide-react';

export function ClientList() {
  const { clients } = useClientStore();
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your clients and their workout programs.
          </p>
        </div>
        <button
          onClick={() => navigate('/clients/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{client.name}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <a href={`tel:${client.phone}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{client.phone}</a>
            </p>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Goals</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {client.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No clients</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding a new client.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/clients/new')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Client
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 