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
    <div className="page-enter space-y-8 bg-pattern min-h-full">
      {/* Hero Section */}
      <div className="text-center pt-8 pb-2 relative">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-fire-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-8 left-1/3 w-32 h-32 bg-pump-500/5 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-5xl md:text-6xl font-display font-extrabold text-gradient-hero relative">
          IronLog
        </h1>
        <p className="text-iron-400 mt-2 text-sm font-medium tracking-widest uppercase">
          Track · Lift · Grow
        </p>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-3 gap-3 stagger-children">
        <div className="glass rounded-2xl p-4 text-center border-gradient hover:scale-[1.02] transition-transform duration-300">
          <p className="text-3xl font-display font-bold text-fire-400">
            {weekWorkouts.length}
          </p>
          <p className="text-[10px] text-iron-400 mt-1.5 uppercase tracking-wider font-medium">This Week</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border-gradient hover:scale-[1.02] transition-transform duration-300">
          <p className="text-3xl font-display font-bold text-energy-400">
            {weeklyVolume > 0 ? `${(weeklyVolume / 1000).toFixed(1)}k` : '0'}
          </p>
          <p className="text-[10px] text-iron-400 mt-1.5 uppercase tracking-wider font-medium">Volume (kg)</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border-gradient hover:scale-[1.02] transition-transform duration-300">
          <p className="text-3xl font-display font-bold text-pump-400">
            {weeklyDuration > 0 ? `${weeklyDuration}` : '0'}
          </p>
          <p className="text-[10px] text-iron-400 mt-1.5 uppercase tracking-wider font-medium">Minutes</p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/new')}
        className="w-full py-4.5 bg-gradient-to-r from-fire-600 via-fire-500 to-fire-400 text-white font-display font-bold text-lg rounded-2xl transition-all duration-300 pulse-glow hover:scale-[1.01] active:scale-[0.98] press relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          🏋️ Start New Workout
        </span>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </button>

      {/* Today's workout */}
      {todayWorkout && (
        <div className="space-y-3 card-enter">
          <h2 className="text-base font-display font-semibold text-iron-100 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-fire-500" />
            Today's Workout
          </h2>
          <WorkoutSummary workout={todayWorkout} />
        </div>
      )}

      {/* Last workout */}
      {lastWorkout && lastWorkout.id !== todayWorkout?.id && (
        <div className="space-y-3 card-enter" style={{ animationDelay: '100ms' }}>
          <h2 className="text-base font-display font-semibold text-iron-100 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-pump-500" />
            Last Workout
          </h2>
          <WorkoutSummary workout={lastWorkout} compact />
        </div>
      )}

      {/* Empty state */}
      {workouts.length === 0 && (
        <div className="text-center py-16 card-enter">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl glass border-gradient flex items-center justify-center">
            <span className="text-4xl">🏋️</span>
          </div>
          <p className="text-iron-300 text-sm font-medium">No workouts yet</p>
          <p className="text-iron-500 text-xs mt-1">Hit the button above to start lifting!</p>
        </div>
      )}
    </div>
  );
}
