import { create } from 'zustand';
import type { PlannedExercise } from '../hooks/useExercises';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: PlannedExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  name: string;
  clientId: string;
  day: DayOfWeek;
  exercises: PlannedExercise[];
  createdAt: string;
  updatedAt: string;
}

interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  addWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, {
      ...workout,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  updateWorkout: (id, updates) => set((state) => ({
    workouts: state.workouts.map((workout) =>
      workout.id === id
        ? { ...workout, ...updates, updatedAt: new Date().toISOString() }
        : workout
    ),
  })),
  deleteWorkout: (id) => set((state) => ({
    workouts: state.workouts.filter((workout) => workout.id !== id),
  })),
})); 