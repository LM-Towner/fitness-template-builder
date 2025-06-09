import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { subDays, format } from 'date-fns';

export interface WorkoutHistory {
  id: string;
  workoutId: string;
  clientId: string;
  date: string;
  exercises: {
    id: string;
    name: string;
    sets: {
      weight?: number;
      reps?: number;
      duration?: number;
      distance?: number;
      completed: boolean;
    }[];
  }[];
  notes?: string;
  rating?: number;
  completed: boolean;
}

interface ProgressData {
  dates: string[];
  weights: number[];
  reps: number[];
}

interface WorkoutHistoryState {
  history: WorkoutHistory[];
  addWorkoutHistory: (history: Omit<WorkoutHistory, 'id'>) => void;
  updateWorkoutHistory: (id: string, updates: Partial<WorkoutHistory>) => void;
  deleteWorkoutHistory: (id: string) => void;
  getClientHistory: (clientId: string) => WorkoutHistory[];
  getExerciseProgress: (clientId: string, exerciseName: string) => ProgressData;
  getWorkoutCompletionRate: (clientId: string) => number;
  getMostCommonExercises: (clientId: string) => Array<{ name: string; count: number }>;
  initializeSampleData: (clientId: string) => void;
}

const generateSampleWorkout = (clientId: string, daysAgo: number): Omit<WorkoutHistory, 'id'> => {
  const date = subDays(new Date(), daysAgo);
  const exercises = [
    {
      id: 'bench-press',
      name: 'Bench Press',
      sets: [
        { weight: 60 + Math.floor(daysAgo / 2), reps: 12, completed: true },
        { weight: 65 + Math.floor(daysAgo / 2), reps: 10, completed: true },
        { weight: 70 + Math.floor(daysAgo / 2), reps: 8, completed: true },
      ],
    },
    {
      id: 'squats',
      name: 'Squats',
      sets: [
        { weight: 80 + Math.floor(daysAgo / 2), reps: 12, completed: true },
        { weight: 85 + Math.floor(daysAgo / 2), reps: 10, completed: true },
        { weight: 90 + Math.floor(daysAgo / 2), reps: 8, completed: true },
      ],
    },
    {
      id: 'deadlifts',
      name: 'Deadlifts',
      sets: [
        { weight: 100 + Math.floor(daysAgo / 2), reps: 10, completed: true },
        { weight: 110 + Math.floor(daysAgo / 2), reps: 8, completed: true },
        { weight: 120 + Math.floor(daysAgo / 2), reps: 6, completed: true },
      ],
    },
  ];

  return {
    workoutId: uuidv4(),
    clientId,
    date: format(date, 'yyyy-MM-dd'),
    exercises,
    notes: `Great session! Felt strong on ${exercises[0].name}.`,
    rating: 4,
    completed: true,
  };
};

export const useWorkoutHistoryStore = create<WorkoutHistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addWorkoutHistory: (history) => {
        set((state) => ({
          history: [...state.history, { ...history, id: uuidv4() }],
        }));
      },

      updateWorkoutHistory: (id, updates) => {
        set((state) => ({
          history: state.history.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        }));
      },

      deleteWorkoutHistory: (id) => {
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        }));
      },

      getClientHistory: (clientId) => {
        return get().history
          .filter((h) => h.clientId === clientId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getExerciseProgress: (clientId: string, exerciseName: string): ProgressData => {
        const history = get().history.filter(
          (workout) => workout.clientId === clientId && workout.completed
        );

        // Sort workouts by date
        const sortedWorkouts = [...history].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Filter and map only the selected exercise's data
        const progressData = sortedWorkouts
          .map((workout) => {
            const exercise = workout.exercises.find((e) => e.name === exerciseName);
            if (!exercise || !exercise.sets.length) return null;

            // Get the highest weight and corresponding reps from the exercise's sets
            const maxWeightSet = exercise.sets.reduce(
              (max, set) => {
                const currentWeight = set.weight ?? 0;
                const maxWeight = max.weight ?? 0;
                return currentWeight > maxWeight ? set : max;
              },
              exercise.sets[0]
            );

            return {
              date: workout.date,
              weight: maxWeightSet.weight ?? 0,
              reps: maxWeightSet.reps ?? 0,
            };
          })
          .filter((data): data is NonNullable<typeof data> => data !== null);

        return {
          dates: progressData.map((data) => data.date),
          weights: progressData.map((data) => data.weight),
          reps: progressData.map((data) => data.reps),
        };
      },

      getWorkoutCompletionRate: (clientId) => {
        const clientHistory = get().getClientHistory(clientId);
        if (clientHistory.length === 0) return 0;
        
        const completed = clientHistory.filter((h) => h.completed).length;
        return (completed / clientHistory.length) * 100;
      },

      getMostCommonExercises: (clientId) => {
        const clientHistory = get().getClientHistory(clientId);
        const exerciseCounts = new Map<string, number>();

        clientHistory.forEach((h) => {
          h.exercises.forEach((e) => {
            exerciseCounts.set(e.name, (exerciseCounts.get(e.name) || 0) + 1);
          });
        });

        return Array.from(exerciseCounts.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      },

      initializeSampleData: (clientId) => {
        // Generate 10 sample workouts over the past 30 days
        const sampleWorkouts = Array.from({ length: 10 }, (_, i) => ({
          ...generateSampleWorkout(clientId, i * 3),
          id: uuidv4(),
        }));

        set((state) => ({
          history: [...state.history, ...sampleWorkouts],
        }));
      },
    }),
    {
      name: 'workout-history-storage',
    }
  )
); 