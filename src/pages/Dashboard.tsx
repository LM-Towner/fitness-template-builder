import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { useClientStore } from '../store/clientStore';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { QuickLog } from '../components/QuickLog';

export function Dashboard() {
  const [showQuickLog, setShowQuickLog] = useState(false);
  const { workouts, getWorkoutStats } = useWorkoutStore();
  const { clients, getClientAnalytics } = useClientStore();
  const stats = getWorkoutStats();

  // Calculate client-focused stats
  const totalClients = clients.length;
  const activeClients = clients.filter(client => {
    const lastWorkout = workouts
      .filter(w => w.clientId === client.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return lastWorkout && new Date(lastWorkout.date) >= subDays(new Date(), 30);
  }).length;

  // Calculate client progress
  const clientProgress = clients.map(client => {
    const analytics = getClientAnalytics(client.id);
    return {
      id: client.id,
      name: client.name,
      progress: analytics.progressOverTime,
      attendance: analytics.averageAttendanceRate,
      workoutCompletion: analytics.workoutCompletionRate,
    };
  });

  // Calculate weekly progress
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= weekStart && workoutDate <= weekEnd;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness Management Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track client progress, manage workouts, and monitor performance
            </p>
          </div>
          <button
            onClick={() => setShowQuickLog(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Quick Log Exercise
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Clients</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{totalClients}</dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Clients</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{activeClients}</dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Workouts</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">{stats.totalWorkouts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completion Rate</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {((stats.completedWorkouts / stats.totalWorkouts) * 100 || 0).toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Client Progress */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Client Progress</h3>
            <Link
              to="/clients"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              View All Clients
            </Link>
          </div>
          <div className="mt-4">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {clientProgress.slice(0, 5).map((client) => (
                  <li key={client.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {client.name}
                        </p>
                        <div className="mt-2 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {(client.attendance * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Workout Completion</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {(client.workoutCompletion * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {client.progress.length > 0 ? 'Active' : 'No Data'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/clients/${client.id}`}
                          className="inline-flex items-center shadow-sm px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">This Week's Schedule</h3>
          <div className="mt-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day: Date, index: number) => {
                const dayWorkouts = weeklyWorkouts.filter(workout => 
                  format(new Date(workout.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                );
                return (
                  <div
                    key={index}
                    className={`p-2 text-center rounded-lg ${
                      dayWorkouts.length > 0
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                    <div className="text-sm">{format(day, 'd')}</div>
                    {dayWorkouts.length > 0 && (
                      <div className="mt-1 text-xs font-medium">
                        {dayWorkouts.length} {dayWorkouts.length === 1 ? 'Workout' : 'Workouts'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/clients/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add New Client
            </Link>
            <Link
              to="/workout-planner"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Workout
            </Link>
            <Link
              to="/templates"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </div>

      {showQuickLog && <QuickLog onClose={() => setShowQuickLog(false)} />}
    </div>
  );
} 