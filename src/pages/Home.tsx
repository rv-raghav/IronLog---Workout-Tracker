import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useWorkoutStore } from '../app/store';
import WorkoutSummary from '../components/WorkoutSummary';

export default function Home() {
  const { workouts, loadFromStorage } = useWorkoutStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayWorkout = workouts.find((w) => w.date === today);
  const lastWorkout = workouts.find((w) => w.date !== today) || workouts[0];

  // Weekly stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekWorkouts = workouts.filter(
    (w) => new Date(w.date + 'T00:00:00') >= weekAgo
  );
  const weeklyVolume = weekWorkouts.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce(
        (es, ex) => es + ex.sets.reduce((ss, s) => ss + s.weight * s.reps, 0),
        0
      ),
    0
  );
  const weeklyDuration = weekWorkouts.reduce((sum, w) => sum + w.totalDuration, 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-fire-400 via-fire-500 to-pump-500 bg-clip-text text-transparent">
          🔥 IronLog
        </h1>
        <p className="text-iron-400 mt-2 text-sm">Track. Lift. Grow.</p>
      </div>

      {/* Weekly summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-iron-800 rounded-2xl border border-iron-600/40 p-4 text-center">
          <p className="text-2xl font-display font-bold text-fire-400">
            {weekWorkouts.length}
          </p>
          <p className="text-xs text-iron-400 mt-1">This Week</p>
        </div>
        <div className="bg-iron-800 rounded-2xl border border-iron-600/40 p-4 text-center">
          <p className="text-2xl font-display font-bold text-energy-400">
            {weeklyVolume > 0 ? `${(weeklyVolume / 1000).toFixed(1)}k` : '0'}
          </p>
          <p className="text-xs text-iron-400 mt-1">Volume (kg)</p>
        </div>
        <div className="bg-iron-800 rounded-2xl border border-iron-600/40 p-4 text-center">
          <p className="text-2xl font-display font-bold text-pump-400">
            {weeklyDuration > 0 ? `${weeklyDuration}` : '0'}
          </p>
          <p className="text-xs text-iron-400 mt-1">Minutes</p>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => navigate('/new')}
        className="w-full py-4 bg-gradient-to-r from-fire-600 to-fire-500 hover:from-fire-500 hover:to-fire-400 text-white font-display font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-fire-500/25 hover:shadow-fire-500/40 hover:scale-[1.01] active:scale-[0.99]"
      >
        🏋️ Start New Workout
      </button>

      {/* Today's workout */}
      {todayWorkout && (
        <div className="space-y-3">
          <h2 className="text-lg font-display font-semibold text-iron-100 flex items-center gap-2">
            📅 Today's Workout
          </h2>
          <WorkoutSummary workout={todayWorkout} />
        </div>
      )}

      {/* Last workout */}
      {lastWorkout && lastWorkout.id !== todayWorkout?.id && (
        <div className="space-y-3">
          <h2 className="text-lg font-display font-semibold text-iron-100 flex items-center gap-2">
            🕒 Last Workout
          </h2>
          <WorkoutSummary workout={lastWorkout} compact />
        </div>
      )}

      {/* Empty state */}
      {workouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-5xl mb-4">🏋️</p>
          <p className="text-iron-400 text-sm">No workouts yet. Time to start lifting!</p>
        </div>
      )}
    </div>
  );
}
