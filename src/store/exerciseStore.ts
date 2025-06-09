import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Exercise, ExerciseType } from '../hooks/useExercises';

interface ExerciseState {
  customExercises: Exercise[];
  addCustomExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateCustomExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteCustomExercise: (id: string) => void;
  getCustomExerciseById: (id: string) => Exercise | undefined;
  getAllExercises: () => Exercise[];
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      customExercises: [],
      addCustomExercise: (exercise) => {
        const newExercise: Exercise = {
          ...exercise,
          id: uuidv4(),
        };
        set((state) => ({
          customExercises: [...state.customExercises, newExercise],
        }));
      },
      updateCustomExercise: (id, updates) => {
        set((state) => ({
          customExercises: state.customExercises.map((exercise) =>
            exercise.id === id ? { ...exercise, ...updates } : exercise
          ),
        }));
      },
      deleteCustomExercise: (id) => {
        set((state) => ({
          customExercises: state.customExercises.filter((exercise) => exercise.id !== id),
        }));
      },
      getCustomExerciseById: (id) => {
        return get().customExercises.find((exercise) => exercise.id === id);
      },
      getAllExercises: () => {
        return get().customExercises;
      },
    }),
    {
      name: 'custom-exercises-storage',
    }
  )
); 