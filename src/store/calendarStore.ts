import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSameDay } from 'date-fns';
import type { Workout } from './workoutStore';

export interface RecurringSchedule {
  id: string;
  clientId: string;
  templateId: string;
  daysOfWeek: string[];
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface ScheduledWorkout extends Workout {
  scheduleId: string;
  templateId: string;
}

interface CalendarState {
  recurringSchedules: RecurringSchedule[];
  scheduledWorkouts: ScheduledWorkout[];
  addRecurringSchedule: (schedule: Omit<RecurringSchedule, 'id'>) => void;
  updateRecurringSchedule: (id: string, schedule: Partial<RecurringSchedule>) => void;
  deleteRecurringSchedule: (id: string) => void;
  getScheduledWorkout: (scheduleId: string, date: Date) => ScheduledWorkout | undefined;
  updateScheduledWorkout: (scheduleId: string, date: Date, workout: Workout) => void;
  deleteScheduledWorkout: (scheduleId: string, date: Date) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      recurringSchedules: [],
      scheduledWorkouts: [],

      addRecurringSchedule: (schedule) => {
        const newSchedule = {
          ...schedule,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          recurringSchedules: [...state.recurringSchedules, newSchedule],
        }));
      },

      updateRecurringSchedule: (id, schedule) => {
        set((state) => ({
          recurringSchedules: state.recurringSchedules.map((s) =>
            s.id === id ? { ...s, ...schedule } : s
          ),
        }));
      },

      deleteRecurringSchedule: (id) => {
        set((state) => ({
          recurringSchedules: state.recurringSchedules.filter((s) => s.id !== id),
          scheduledWorkouts: state.scheduledWorkouts.filter((w) => w.scheduleId !== id),
        }));
      },

      getScheduledWorkout: (scheduleId, date) => {
        return get().scheduledWorkouts.find(
          (workout) =>
            workout.scheduleId === scheduleId &&
            isSameDay(new Date(workout.date), date)
        );
      },

      updateScheduledWorkout: (scheduleId, date, workout) => {
        set((state) => {
          const existingWorkoutIndex = state.scheduledWorkouts.findIndex(
            (w) =>
              w.scheduleId === scheduleId &&
              isSameDay(new Date(w.date), date)
          );

          const newWorkout: ScheduledWorkout = {
            ...workout,
            scheduleId,
            templateId: workout.templateId || '',
          };

          if (existingWorkoutIndex >= 0) {
            const updatedWorkouts = [...state.scheduledWorkouts];
            updatedWorkouts[existingWorkoutIndex] = newWorkout;
            return { scheduledWorkouts: updatedWorkouts };
          } else {
            return {
              scheduledWorkouts: [...state.scheduledWorkouts, newWorkout],
            };
          }
        });
      },

      deleteScheduledWorkout: (scheduleId, date) => {
        set((state) => ({
          scheduledWorkouts: state.scheduledWorkouts.filter(
            (workout) =>
              !(
                workout.scheduleId === scheduleId &&
                isSameDay(new Date(workout.date), date)
              )
          ),
        }));
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
); 