import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useCalendarStore } from '../store/calendarStore';
import { useClientStore } from '../store/clientStore';
import { ScheduledWorkoutEditor } from './ScheduledWorkoutEditor';
import type { ScheduledWorkout } from '../store/calendarStore';

interface CalendarProps {
  onWorkoutClick?: (workout: ScheduledWorkout) => void;
}

export function Calendar({ onWorkoutClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<{ scheduleId: string; date: Date } | null>(null);
  const { scheduledWorkouts } = useCalendarStore();
  const { clients } = useClientStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getWorkoutsForDay = (date: Date) => {
    return scheduledWorkouts.filter(workout => 
      format(new Date(workout.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleWorkoutClick = (workout: ScheduledWorkout) => {
    if (onWorkoutClick) {
      onWorkoutClick(workout);
    } else {
      setSelectedWorkout({
        scheduleId: workout.scheduleId,
        date: new Date(workout.date)
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}

          {days.map((day) => {
            const workouts = getWorkoutsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 ${
                  !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900' : ''
                } ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {workouts.map((workout) => (
                    <button
                      key={workout.id}
                      onClick={() => handleWorkoutClick(workout)}
                      className="w-full text-left text-xs p-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded truncate hover:bg-blue-200 dark:hover:bg-blue-700"
                    >
                      {getClientName(workout.clientId)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
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