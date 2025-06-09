import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { PlannedExercise } from '../hooks/useExercises';
import type { DayOfWeek } from './workoutStore';

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: PlannedExercise[];
  dayOfWeek?: DayOfWeek;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringSchedule {
  id: string;
  clientId: string;
  templateId: string;
  daysOfWeek: DayOfWeek[];
  startDate: string;
  endDate?: string;
  active: boolean;
}

interface TemplateStore {
  templates: WorkoutTemplate[];
  recurringSchedules: RecurringSchedule[];
  addTemplate: (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, template: Partial<WorkoutTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => WorkoutTemplate | undefined;
  getPublicTemplates: () => WorkoutTemplate[];
  getTemplatesByDay: (day: DayOfWeek) => WorkoutTemplate[];
  addRecurringSchedule: (schedule: Omit<RecurringSchedule, 'id'>) => void;
  updateRecurringSchedule: (id: string, schedule: Partial<RecurringSchedule>) => void;
  deleteRecurringSchedule: (id: string) => void;
  getRecurringSchedulesByClient: (clientId: string) => RecurringSchedule[];
  getRecurringSchedulesByTemplate: (templateId: string) => RecurringSchedule[];
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],
      recurringSchedules: [],

      addTemplate: (template) => {
        const newTemplate: WorkoutTemplate = {
          ...template,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));
      },

      updateTemplate: (id, template) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id
              ? { ...t, ...template, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          recurringSchedules: state.recurringSchedules.filter((s) => s.templateId !== id),
        }));
      },

      getTemplateById: (id) => {
        return get().templates.find((t) => t.id === id);
      },

      getPublicTemplates: () => {
        return get().templates.filter((t) => t.isPublic);
      },

      getTemplatesByDay: (day) => {
        return get().templates.filter((t) => t.dayOfWeek === day);
      },

      addRecurringSchedule: (schedule) => {
        const newSchedule: RecurringSchedule = {
          ...schedule,
          id: uuidv4(),
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
        }));
      },

      getRecurringSchedulesByClient: (clientId) => {
        return get().recurringSchedules.filter((s) => s.clientId === clientId);
      },

      getRecurringSchedulesByTemplate: (templateId) => {
        return get().recurringSchedules.filter((s) => s.templateId === templateId);
      },
    }),
    {
      name: 'workout-templates',
    }
  )
); 