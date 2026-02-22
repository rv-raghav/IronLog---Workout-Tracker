import { useNavigate } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm';
import { useWorkoutStore } from '../app/store';
import { useEffect } from 'react';

export default function NewWorkout() {
  const navigate = useNavigate();
  const initCurrentWorkout = useWorkoutStore((s) => s.initCurrentWorkout);

  useEffect(() => {
    initCurrentWorkout();
  }, [initCurrentWorkout]);

  const handleSave = () => {
    navigate('/');
  };

  return (
    <div className="page-enter space-y-6 bg-pattern min-h-full">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/[0.06] text-iron-400 hover:text-iron-100 hover:border-white/[0.12] transition-all duration-200 press"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4L6 9l5 5" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient-fire">
            New Workout
          </h1>
          <p className="text-xs text-iron-500 mt-0.5">Build your session 💪</p>
        </div>
      </div>

      <WorkoutForm onSave={handleSave} />
    </div>
  );
}
