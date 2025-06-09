import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useExercises } from '../hooks/useExercises';
import { useClientStore } from '../store/clientStore';
import { useTemplateStore } from '../store/templateStore';
import { useWorkoutStore } from '../stores/workoutStore';
import type { DayOfWeek, Client, WorkoutTemplate } from '../stores/workoutStore';
import type { Exercise, PlannedExercise } from '../hooks/useExercises';
import { WorkoutHeader } from '../components/workout/WorkoutHeader';
import { WorkoutExerciseSelector } from '../components/workout/WorkoutExerciseSelector';
import { WorkoutPlannedExercises } from '../components/workout/WorkoutPlannedExercises';

export default function WorkoutPlanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: isLoadingExercises } = useExercises();
  const { clients } = useClientStore();
  const { templates, addTemplate } = useTemplateStore();
  const { addWorkout } = useWorkoutStore();

  const [workoutName, setWorkoutName] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [plannedExercises, setPlannedExercises] = useState<PlannedExercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add initial templates if none exist
  useEffect(() => {
    if (templates.length === 0) {
      const initialTemplates = [
        {
          name: 'Full Body Workout',
          description: 'A comprehensive full body workout targeting all major muscle groups',
          exercises: [],
          dayOfWeek: 'Monday' as DayOfWeek,
          isPublic: true
        },
        {
          name: 'Upper Body Focus',
          description: 'Focus on chest, back, shoulders, and arms',
          exercises: [],
          dayOfWeek: 'Wednesday' as DayOfWeek,
          isPublic: true
        },
        {
          name: 'Lower Body Focus',
          description: 'Focus on legs, glutes, and core',
          exercises: [],
          dayOfWeek: 'Friday' as DayOfWeek,
          isPublic: true
        }
      ];

      initialTemplates.forEach(template => addTemplate(template));
    }
  }, [templates.length, addTemplate]);

  useEffect(() => {
    if (selectedTemplate) {
      setPlannedExercises(selectedTemplate.exercises);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    // Initialize with client ID if present
    if (location.state?.clientId) {
      const client = clients.find((c: Client) => c.id === location.state.clientId);
      if (client) {
        setSelectedClient(client);
      }
    }

    // Initialize with template if present
    if (location.state?.templateId) {
      const template = templates.find((t: WorkoutTemplate) => t.id === location.state.templateId);
      if (template) {
        setSelectedTemplate(template);
        setWorkoutName(template.name);
        setPlannedExercises(template.exercises);
      }
    }
  }, [location.state, clients, templates]);

  if (isLoadingExercises) {
    return <div>Loading...</div>;
  }

  const handleExerciseSelect = (exercise: Exercise) => {
    const newExercise: PlannedExercise = {
      exercise,
      sets: exercise.defaultReps?.sets || 3,
      reps: exercise.defaultReps?.reps || 0,
      weight: exercise.type === 'strength' ? 0 : 0,
      duration: exercise.defaultReps?.duration || 0,
      distance: exercise.defaultReps?.distance || 0,
      notes: '',
    };
    setPlannedExercises([...plannedExercises, newExercise]);
  };

  const handleRemoveExercise = (index: number) => {
    setPlannedExercises(plannedExercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index: number, updates: Partial<PlannedExercise>) => {
    setPlannedExercises(plannedExercises.map((exercise, i) => 
      i === index ? { ...exercise, ...updates } : exercise
    ));
  };

  const handleReorderExercises = (startIndex: number, endIndex: number) => {
    const result = Array.from(plannedExercises);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setPlannedExercises(result);
  };

  const handleSave = async () => {
    try {
      if (!selectedClient || !workoutName || plannedExercises.length === 0) {
        setError('Please fill in all required fields and add at least one exercise');
        return;
      }

      const workoutData = {
        name: workoutName,
        clientId: selectedClient.id,
        day: selectedDay,
        exercises: plannedExercises,
      };

      addWorkout(workoutData);
      setSuccess('Workout saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save workout. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <WorkoutHeader
          workoutName={workoutName}
          selectedClient={selectedClient}
          selectedDay={selectedDay}
          selectedTemplate={selectedTemplate}
          clients={clients}
          templates={templates}
          onWorkoutNameChange={setWorkoutName}
          onClientChange={setSelectedClient}
          onDayChange={setSelectedDay}
          onTemplateChange={setSelectedTemplate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkoutExerciseSelector
            onSelectExercise={handleExerciseSelect}
          />

          <WorkoutPlannedExercises
            exercises={plannedExercises}
            onRemoveExercise={handleRemoveExercise}
            onUpdateExercise={handleUpdateExercise}
            onReorderExercises={handleReorderExercises}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
} 