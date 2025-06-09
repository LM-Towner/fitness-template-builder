import { useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useCalendarStore } from '../store/calendarStore';
import { useClientStore } from '../store/clientStore';
import { useTemplateStore } from '../store/templateStore';
import { RecurringScheduleForm } from '../components/RecurringScheduleForm';
import { Calendar } from '../components/Calendar';
import { ScheduledWorkoutEditor } from '../components/ScheduledWorkoutEditor';
import type { ScheduledWorkout } from '../store/calendarStore';
import { exportCalendarToCSV, downloadCalendarCSV } from '../utils/exportCalendar';

export function ScheduleManager() {
  const { recurringSchedules, deleteRecurringSchedule, scheduledWorkouts } = useCalendarStore();
  const { clients } = useClientStore();
  const { templates } = useTemplateStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<{ scheduleId: string; date: Date } | null>(null);
  const [currentDate] = useState(new Date());

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || 'Unknown Template';
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteRecurringSchedule(scheduleId);
    }
  };

  const handleWorkoutClick = (workout: ScheduledWorkout) => {
    setSelectedWorkout({
      scheduleId: workout.scheduleId,
      date: new Date(workout.date)
    });
  };

  const handleExportCalendar = () => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    
    const csvContent = exportCalendarToCSV(scheduledWorkouts, {
      startDate,
      endDate,
      clients,
      templates
    });

    const filename = `calendar-export-${format(currentDate, 'yyyy-MM')}.csv`;
    downloadCalendarCSV(csvContent, filename);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Manager</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleExportCalendar}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Export Calendar
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showForm ? 'Hide Form' : 'Add Schedule'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add Recurring Schedule</h2>
          <RecurringScheduleForm onSave={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Active Schedules</h2>
          <div className="space-y-4">
            {recurringSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {getClientName(schedule.clientId)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Template: {getTemplateName(schedule.templateId)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Days: {schedule.daysOfWeek.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Start: {format(new Date(schedule.startDate), 'MMM d, yyyy')}
                      {schedule.endDate && ` - ${format(new Date(schedule.endDate), 'MMM d, yyyy')}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {recurringSchedules.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">No active schedules</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Calendar View</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <Calendar onWorkoutClick={handleWorkoutClick} />
          </div>
        </div>
      </div>

      {selectedWorkout && (
        <ScheduledWorkoutEditor
          scheduleId={selectedWorkout.scheduleId}
          date={selectedWorkout.date}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
} 