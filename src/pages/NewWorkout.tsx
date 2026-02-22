import { useNavigate } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm';
import { useWorkoutStore } from '../app/store';
import { useEffect } from 'react';

export default function NewWorkout() {
  const navigate = useNavigate();
  const initCurrentWorkout = useWorkoutStore((s) => s.initCurrentWorkout);

  // Initialize a fresh workout on mount
  useEffect(() => {
    initCurrentWorkout();
  }, [initCurrentWorkout]);

  const handleSave = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-iron-800 border border-iron-600/40 text-iron-400 hover:text-iron-200 hover:border-iron-500 transition-all"
        >
          ←
        </button>
        <h1 className="text-2xl font-display font-bold text-iron-100">
          New Workout
        </h1>
      </div>

      <WorkoutForm onSave={handleSave} />
    </div>
  );
}
