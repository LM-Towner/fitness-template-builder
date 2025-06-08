import type { DayOfWeek } from '../utils/constants';

export type WorkoutType = 'Cardio' | 'Strength' | 'Flexibility' | 'Recovery';

export interface WorkoutBlock {
  id: string;
  type: WorkoutType;
  name: string;
  description: string;
}

export type PlannerState = Record<DayOfWeek, WorkoutBlock[]>; 