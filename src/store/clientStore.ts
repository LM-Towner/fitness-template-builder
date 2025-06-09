import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  goals: string[];
  notes: string;
  joinDate: string;
  progress: {
    weight?: number;
    bodyFat?: number;
    measurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      arms?: number;
      thighs?: number;
    };
    lastUpdated: string;
  };
  workoutHistory: {
    workoutId: string;
    date: string;
    completed: boolean;
    notes?: string;
    performance?: {
      exerciseId: string;
      sets: number;
      reps: number;
      weight: number;
      notes?: string;
    }[];
  }[];
  attendance: {
    date: string;
    status: 'present' | 'absent' | 'cancelled';
    notes?: string;
  }[];
  nutrition: {
    date: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    notes?: string;
  }[];
}

interface ClientStore {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'joinDate' | 'progress' | 'workoutHistory' | 'attendance' | 'nutrition'>) => { success: boolean; error?: string };
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  addWorkoutToHistory: (clientId: string, workout: Client['workoutHistory'][0]) => void;
  updateProgress: (clientId: string, progress: Partial<Client['progress']>) => void;
  addAttendance: (clientId: string, attendance: Client['attendance'][0]) => void;
  addNutrition: (clientId: string, nutrition: Client['nutrition'][0]) => void;
  getClientAnalytics: (clientId: string) => {
    workoutCompletionRate: number;
    averageAttendanceRate: number;
    progressOverTime: {
      date: string;
      weight?: number;
      bodyFat?: number;
    }[];
    mostFrequentExercises: { exerciseId: string; count: number }[];
    nutritionAverages: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  };
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-0123',
          goals: ['Lose 10kg', 'Improve cardiovascular fitness', 'Build muscle mass'],
          notes: 'Prefers morning workouts. Has a history of knee injury.',
          joinDate: new Date().toISOString(),
          progress: {
            weight: 85,
            bodyFat: 22,
            measurements: {
              chest: 100,
              waist: 90,
              hips: 95,
              arms: 35,
              thighs: 55,
            },
            lastUpdated: new Date().toISOString(),
          },
          workoutHistory: [],
          attendance: [],
          nutrition: [],
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-0124',
          goals: ['Improve flexibility', 'Increase strength', 'Maintain current weight'],
          notes: 'Enjoys yoga and pilates. Available for evening sessions.',
          joinDate: new Date().toISOString(),
          progress: {
            weight: 65,
            bodyFat: 18,
            measurements: {
              chest: 90,
              waist: 70,
              hips: 90,
              arms: 30,
              thighs: 50,
            },
            lastUpdated: new Date().toISOString(),
          },
          workoutHistory: [],
          attendance: [],
          nutrition: [],
        },
      ],
      addClient: (client) => {
        // Validate required fields
        if (!client.name.trim()) {
          return { success: false, error: 'Name is required' };
        }
        if (!client.email.trim()) {
          return { success: false, error: 'Email is required' };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(client.email)) {
          return { success: false, error: 'Invalid email format' };
        }

        // Check for duplicate email
        const existingClient = get().clients.find(c => c.email.toLowerCase() === client.email.toLowerCase());
        if (existingClient) {
          return { success: false, error: 'A client with this email already exists' };
        }

        // Validate phone number if provided
        if (client.phone && !/^\+?[\d\s-()]+$/.test(client.phone)) {
          return { success: false, error: 'Invalid phone number format' };
        }

        // Validate goals
        const validGoals = client.goals.filter(goal => goal.trim() !== '');
        if (validGoals.length === 0) {
          return { success: false, error: 'At least one goal is required' };
        }

        const newClient: Client = {
          ...client,
          id: crypto.randomUUID(),
          joinDate: new Date().toISOString(),
          progress: {
            lastUpdated: new Date().toISOString(),
          },
          workoutHistory: [],
          attendance: [],
          nutrition: [],
        };

        set((state) => ({ clients: [...state.clients, newClient] }));
        return { success: true };
      },
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ),
        }));
      },
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },
      getClientById: (id) => {
        return get().clients.find((client) => client.id === id);
      },
      addWorkoutToHistory: (clientId, workout) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, workoutHistory: [...client.workoutHistory, workout] }
              : client
          ),
        }));
      },
      updateProgress: (clientId, progress) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  progress: {
                    ...client.progress,
                    ...progress,
                    lastUpdated: new Date().toISOString(),
                  },
                }
              : client
          ),
        }));
      },
      addAttendance: (clientId, attendance) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, attendance: [...client.attendance, attendance] }
              : client
          ),
        }));
      },
      addNutrition: (clientId, nutrition) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, nutrition: [...client.nutrition, nutrition] }
              : client
          ),
        }));
      },
      getClientAnalytics: (clientId) => {
        const client = get().clients.find((c) => c.id === clientId);
        if (!client) {
          throw new Error('Client not found');
        }

        // Calculate workout completion rate
        const completedWorkouts = client.workoutHistory.filter((w) => w.completed).length;
        const workoutCompletionRate = client.workoutHistory.length
          ? (completedWorkouts / client.workoutHistory.length) * 100
          : 0;

        // Calculate attendance rate
        const presentSessions = client.attendance.filter((a) => a.status === 'present').length;
        const averageAttendanceRate = client.attendance.length
          ? (presentSessions / client.attendance.length) * 100
          : 0;

        // Get progress over time
        const progressOverTime = client.workoutHistory
          .filter((w) => w.completed)
          .map((w) => ({
            date: w.date,
            weight: client.progress.weight ?? undefined,
            bodyFat: client.progress.bodyFat ?? undefined,
          }));

        // Get most frequent exercises
        const exerciseCounts = client.workoutHistory.reduce((acc, workout) => {
          workout.performance?.forEach((p) => {
            acc[p.exerciseId] = (acc[p.exerciseId] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>);

        const mostFrequentExercises = Object.entries(exerciseCounts)
          .map(([exerciseId, count]) => ({ exerciseId, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Calculate nutrition averages
        const nutritionAverages = client.nutrition.reduce(
          (acc, entry) => ({
            calories: (acc.calories || 0) + (entry.calories || 0),
            protein: (acc.protein || 0) + (entry.protein || 0),
            carbs: (acc.carbs || 0) + (entry.carbs || 0),
            fat: (acc.fat || 0) + (entry.fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        const nutritionCount = client.nutrition.length;
        if (nutritionCount > 0) {
          nutritionAverages.calories = Math.round(nutritionAverages.calories / nutritionCount);
          nutritionAverages.protein = Math.round(nutritionAverages.protein / nutritionCount);
          nutritionAverages.carbs = Math.round(nutritionAverages.carbs / nutritionCount);
          nutritionAverages.fat = Math.round(nutritionAverages.fat / nutritionCount);
        }

        return {
          workoutCompletionRate,
          averageAttendanceRate,
          progressOverTime,
          mostFrequentExercises,
          nutritionAverages,
        };
      },
    }),
    {
      name: 'client-storage',
    }
  )
); 