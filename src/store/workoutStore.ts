import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { PlannedExercise } from '../hooks/useExercises';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Workout {
  id: string;
  name: string;
  date: string;
  dayOfWeek?: DayOfWeek;
  clientId: string;
  templateId: string;
  exercises: PlannedExercise[];
  completed: boolean;
  notes?: string;
}

interface WorkoutState {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  getClientWorkouts: (clientId: string) => Workout[];
  getClientWorkoutsByDay: (clientId: string, day: DayOfWeek) => Workout[];
  continueWorkout: (workoutId: string) => Workout | undefined;
  completeWorkout: (workoutId: string) => void;
  getWorkoutStats: (clientId: string) => {
    totalWorkouts: number;
    completedWorkouts: number;
    totalExercises: number;
    averageExercisesPerWorkout: number;
  };
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],

      addWorkout: (workout) => {
        set((state) => ({
          workouts: [...state.workouts, workout],
        }));
      },

      updateWorkout: (id, updatedWorkout) => {
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === id ? { ...workout, ...updatedWorkout } : workout
          ),
        }));
      },

      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== id),
        }));
      },

      getWorkoutById: (id) => {
        return get().workouts.find((workout) => workout.id === id);
      },

      getClientWorkouts: (clientId) => {
        return get().workouts.filter((workout) => workout.clientId === clientId);
      },

      getClientWorkoutsByDay: (clientId, day) => {
        return get().workouts.filter(
          (workout) => workout.clientId === clientId && workout.dayOfWeek === day
        );
      },

      continueWorkout: (workoutId) => {
        const workout = get().getWorkoutById(workoutId);
        if (!workout) return undefined;

        const newWorkout: Workout = {
          ...workout,
          id: uuidv4(),
          date: new Date().toISOString(),
          completed: false,
          exercises: workout.exercises.map((exercise) => ({
            ...exercise,
            completed: false,
            weight: undefined,
            reps: undefined,
          })),
        };

        get().addWorkout(newWorkout);
        return newWorkout;
      },

      completeWorkout: (workoutId) => {
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId ? { ...workout, completed: true } : workout
          ),
        }));
      },

      getWorkoutStats: (clientId) => {
        const clientWorkouts = get().getClientWorkouts(clientId);
        const totalWorkouts = clientWorkouts.length;
        const completedWorkouts = clientWorkouts.filter((w) => w.completed).length;
        const totalExercises = clientWorkouts.reduce(
          (sum, workout) => sum + workout.exercises.length,
          0
        );
        const averageExercisesPerWorkout =
          totalWorkouts > 0 ? totalExercises / totalWorkouts : 0;

        return {
          totalWorkouts,
          completedWorkouts,
          totalExercises,
          averageExercisesPerWorkout,
        };
      },
    }),
    {
      name: 'workout-storage',
    }
  )
); 