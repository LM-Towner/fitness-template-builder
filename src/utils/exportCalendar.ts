import { format } from 'date-fns';
import type { ScheduledWorkout } from '../store/calendarStore';
import type { Client } from '../store/clientStore';
import type { WorkoutTemplate } from '../store/templateStore';

interface ExportOptions {
  startDate: Date;
  endDate: Date;
  clients: Client[];
  templates: WorkoutTemplate[];
}

export function exportCalendarToCSV(
  workouts: ScheduledWorkout[],
  options: ExportOptions
): string {
  const { startDate, endDate, clients, templates } = options;

  // Filter workouts within date range
  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= startDate && workoutDate <= endDate;
  });

  // Create CSV header
  const headers = [
    'Date',
    'Client',
    'Template',
    'Status',
    'Notes'
  ].join(',');

  // Create CSV rows
  const rows = filteredWorkouts.map(workout => {
    const client = clients.find(c => c.id === workout.clientId);
    const template = templates.find(t => t.id === workout.templateId);

    return [
      format(new Date(workout.date), 'yyyy-MM-dd'),
      `"${client?.name || 'Unknown Client'}"`,
      `"${template?.name || 'Unknown Template'}"`,
      workout.completed ? 'Completed' : 'Pending',
      `"${workout.notes || ''}"`
    ].join(',');
  });

  // Combine header and rows
  return [headers, ...rows].join('\n');
}

export function downloadCalendarCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 