import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useWorkoutHistoryStore } from '../../store/workoutHistoryStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { X as XIcon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WorkoutHistoryProps {
  clientId: string;
}

interface WorkoutHistory {
  id: string;
  clientId: string;
  date: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      weight?: number;
      reps?: number;
    }>;
  }>;
  notes?: string;
  completed: boolean;
}

interface ProgressData {
  dates: string[];
  weights: number[];
  reps: number[];
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ clientId }) => {
  const { getClientHistory, getExerciseProgress, getMostCommonExercises } = useWorkoutHistoryStore();
  const history = getClientHistory(clientId);
  const commonExercises = getMostCommonExercises(clientId);
  const [selectedExercise, setSelectedExercise] = useState<string>(
    commonExercises.length > 0 ? commonExercises[0].name : ""
  );
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutHistory | null>(null);

  useEffect(() => {
    getClientHistory(clientId);
  }, [clientId, getClientHistory]);

  useEffect(() => {
    if (selectedExercise) {
      const progress = getExerciseProgress(clientId, selectedExercise);
      setProgressData(progress);
    } else {
      setProgressData(null);
    }
  }, [selectedExercise, clientId, getExerciseProgress]);

  const chartData = progressData
    ? {
        labels: progressData.dates.map((date) => format(new Date(date), 'MMM d')),
        datasets: [
          {
            label: 'Weight (kg)',
            data: progressData.weights,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 3,
          },
          {
            label: 'Reps',
            data: progressData.reps,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 3,
          },
        ],
      }
    : {
        labels: [],
        datasets: [],
      };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(tooltipItem: TooltipItem<'line'>) {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.parsed.y;
            if (value !== null) {
              return `${label}: ${value}${label.includes('Weight') ? ' kg' : ''}`;
            }
            return '';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          padding: 10,
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          padding: 10,
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="space-y-6">
      {/* Exercise Progress Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Exercise Progress
        </h3>
        <div className="mb-4">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select an exercise</option>
            {commonExercises.map((exercise) => (
              <option key={exercise.name} value={exercise.name}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>
        {progressData ? (
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Select an exercise to view progress
          </p>
        )}
      </div>

      {/* Recent Workouts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
        <div className="space-y-4">
          {history.slice(0, 5).map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setSelectedWorkout(workout)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{new Date(workout.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {workout.exercises.length} exercises
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {workout.completed ? "Completed" : "In Progress"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Details Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">
                  Workout on {new Date(selectedWorkout.date).toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                {selectedWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="border-b dark:border-gray-700 pb-4">
                    <h4 className="font-medium mb-2">{exercise.name}</h4>
                    <div className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex gap-4 text-sm">
                          <span>Set {setIndex + 1}:</span>
                          {set.weight && <span>{set.weight} kg</span>}
                          {set.reps && <span>{set.reps} reps</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedWorkout.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedWorkout.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 