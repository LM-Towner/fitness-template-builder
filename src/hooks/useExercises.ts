import { useExerciseStore } from '../store/exerciseStore';

export type ExerciseType = 'strength' | 'cardio' | 'flexibility';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: ExerciseType;
  categoryId: string;
  defaultReps?: {
    sets?: number;
    reps?: number;
    duration?: number;
    distance?: number;
  };
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
}

export interface PlannedExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  duration: number;
  distance: number;
  weight: number;
  notes: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  date: string;
  exercises: PlannedExercise[];
}

// Map of workout block types to category names
export const categoryMap = {
  push: ['Chest', 'Shoulders', 'Arms'],
  pull: ['Back', 'Arms'],
  legs: ['Legs', 'Calves'],
  core: ['Abs'],
  cardio: ['Cardio'],
  flexibility: ['Stretching', 'Flexibility']
};

// Exercise categories
export const categories = [
  { id: '1', name: 'Upper Body' },
  { id: '2', name: 'Lower Body' },
  { id: '3', name: 'Core' },
  { id: '4', name: 'Cardio' },
  { id: '5', name: 'Flexibility' }
];

// Hardcoded exercises
const defaultExercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    description: 'A compound exercise that primarily targets the chest muscles',
    type: 'strength',
    categoryId: '1',
    defaultReps: {
      sets: 3,
      reps: 10,
    },
  },
  {
    id: '2',
    name: 'Squats',
    description: 'A compound exercise that targets the lower body',
    type: 'strength',
    categoryId: '2',
    defaultReps: {
      sets: 3,
      reps: 12,
    },
  },
  {
    id: '3',
    name: 'Running',
    description: 'A cardiovascular exercise that improves endurance',
    type: 'cardio',
    categoryId: '4',
    defaultReps: {
      duration: 30,
      distance: 5000,
    },
  },
  {
    id: '4',
    name: 'Plank',
    description: 'An isometric core exercise that strengthens the abdominal muscles.',
    type: 'strength',
    categoryId: '3',
    defaultReps: {
      sets: 3,
      duration: 60 // 60 seconds
    }
  },
  {
    id: '5',
    name: 'Bicep Curls',
    description: 'An isolation exercise that targets the biceps.',
    type: 'strength',
    categoryId: '1',
    defaultReps: {
      sets: 3,
      reps: 12
    }
  },
  {
    id: '6',
    name: 'Calf Raises',
    description: 'An exercise that targets the calf muscles.',
    type: 'strength',
    categoryId: '2',
    defaultReps: {
      sets: 3,
      reps: 15
    }
  },
  {
    id: '7',
    name: 'Shoulder Press',
    description: 'An exercise that targets the deltoid muscles.',
    type: 'strength',
    categoryId: '1',
    defaultReps: {
      sets: 3,
      reps: 10
    }
  },
  {
    id: '8',
    name: 'Dynamic Stretching',
    description: 'A series of movements that prepare your muscles for exercise.',
    type: 'flexibility',
    categoryId: '5',
    defaultReps: {
      sets: 1,
      duration: 600 // 10 minutes
    }
  }
];

export const useExercises = () => {
  const { customExercises, addCustomExercise } = useExerciseStore();
  const allExercises = [...defaultExercises, ...customExercises];

  const getExercisesByCategory = (categoryIdOrNames: string | string[]) => {
    if (!categoryIdOrNames || (Array.isArray(categoryIdOrNames) && categoryIdOrNames.length === 0)) {
      return allExercises;
    }

    // Convert single category to array if needed
    const categories = Array.isArray(categoryIdOrNames) ? categoryIdOrNames : [categoryIdOrNames];

    // Filter exercises by category IDs
    return allExercises.filter(exercise => 
      categories.includes(exercise.categoryId)
    );
  };

  const createPlannedExercise = (exercise: Exercise): PlannedExercise => {
    return {
      exercise,
      sets: exercise.defaultReps?.sets ?? 3,
      reps: exercise.defaultReps?.reps ?? 0,
      duration: exercise.defaultReps?.duration ?? 0,
      distance: exercise.defaultReps?.distance ?? 0,
      weight: exercise.type === 'strength' ? 0 : 0,
      notes: ''
    };
  };

  const exportToGoogleSheets = async (workoutDays: WorkoutDay[]) => {
    try {
      const sheetData = workoutDays.map((day) => ({
        day: day.name,
        exercises: day.exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets.map((set) => ({
            weight: set.weight,
            reps: set.reps,
          })),
        })),
      }));

      // ... rest of the export logic ...
    } catch (error) {
      console.error('Error exporting to Google Sheets:', error);
      throw error;
    }
  };

  return {
    categories,
    exercises: allExercises,
    isLoading: false,
    error: null,
    getExercisesByCategory,
    createPlannedExercise,
    exportToGoogleSheets,
    addCustomExercise
  };
}; 