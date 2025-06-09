import { useState, useCallback } from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import type { Exercise, DayPlan, WeekPlan } from '../types/planner';

export function usePlannerState() {
  // Initialize the week starting from Sunday
  const initializeWeek = useCallback(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // 0 = Sunday
    
    const weekPlan: WeekPlan = {};
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      weekPlan[dateStr] = {
        date: dateStr,
        exercises: []
      };
    }
    return weekPlan;
  }, []);

  const [weekPlan, setWeekPlan] = useState<WeekPlan>(initializeWeek);

  const addExercise = useCallback((date: string, exercise: Omit<Exercise, 'id'>) => {
    setWeekPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        exercises: [
          ...prev[date].exercises,
          {
            ...exercise,
            id: crypto.randomUUID()
          }
        ]
      }
    }));
  }, []);

  const updateExercise = useCallback((date: string, exerciseId: string, updates: Partial<Exercise>) => {
    setWeekPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        exercises: prev[date].exercises.map(ex => 
          ex.id === exerciseId ? { ...ex, ...updates } : ex
        )
      }
    }));
  }, []);

  const removeExercise = useCallback((date: string, exerciseId: string) => {
    setWeekPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        exercises: prev[date].exercises.filter(ex => ex.id !== exerciseId)
      }
    }));
  }, []);

  return {
    weekPlan,
    addExercise,
    updateExercise,
    removeExercise
  };
} 