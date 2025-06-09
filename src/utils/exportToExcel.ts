import * as XLSX from 'xlsx';
import type { PlannedExercise, Workout } from '../store/workoutStore';

export const exportToExcel = (workouts: Workout[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Convert workouts to worksheet format
  const workoutData = workouts.map(workout => ({
    'Workout Name': workout.name,
    'Date': new Date(workout.date).toLocaleDateString(),
    'Duration (minutes)': workout.duration || 'N/A',
    'Status': workout.completed ? 'Completed' : 'Not Completed',
    'Notes': workout.notes || 'N/A'
  }));

  // Create worksheet for workout summary
  const wsSummary = XLSX.utils.json_to_sheet(workoutData);

  // Add the summary worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Workout Summary');

  // Create detailed exercise data
  const exerciseData = workouts.flatMap(workout => 
    workout.exercises.map(exercise => ({
      'Workout Name': workout.name,
      'Date': new Date(workout.date).toLocaleDateString(),
      'Exercise': exercise.exercise.name,
      'Sets': exercise.sets,
      'Reps': exercise.reps,
      'Weight (kg)': exercise.weight || 'N/A'
    }))
  );

  // Create worksheet for exercise details
  const wsExercises = XLSX.utils.json_to_sheet(exerciseData);

  // Add the exercises worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, wsExercises, 'Exercise Details');

  // Generate Excel file
  XLSX.writeFile(wb, 'workout_history.xlsx');
}; 