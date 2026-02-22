import { useEffect } from 'react';
import { useWorkoutStore } from '../app/store';
import WorkoutSummary from '../components/WorkoutSummary';
import { exportWorkoutsToJSON } from '../utils/storage';

export default function History() {
  const { workouts, loadFromStorage, deleteWorkout } = useWorkoutStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Group by month
  const grouped = workouts.reduce<Record<string, typeof workouts>>((acc, w) => {
    const month = new Date(w.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(w);
    return acc;
  }, {});

  // Total stats
  const totalVolume = workouts.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce(
        (es, ex) => es + ex.sets.reduce((ss, s) => ss + s.weight * s.reps, 0),
        0
      ),
    0
  );

  return (
    <div className="page-enter space-y-6 bg-pattern min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient-fire">
            History
          </h1>
          <p className="text-xs text-iron-500 mt-0.5">Your workout journey 📊</p>
        </div>
        {workouts.length > 0 && (
          <button
            onClick={() => exportWorkoutsToJSON(workouts)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs glass border border-white/[0.06] rounded-xl text-iron-300 hover:text-iron-100 hover:border-white/[0.12] transition-all duration-200 press font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M7 2v8M4 7l3 3 3-3M2 11h10" />
            </svg>
            Export
          </button>
        )}
      </div>

      {/* Stats bar */}
      {workouts.length > 0 && (
        <div className="grid grid-cols-2 gap-3 stagger-children">
          <div className="glass rounded-2xl border border-white/[0.04] p-4 text-center border-gradient hover:scale-[1.02] transition-transform duration-300">
            <p className="text-3xl font-display font-bold text-fire-400">
              {workouts.length}
            </p>
            <p className="text-[10px] text-iron-400 mt-1.5 uppercase tracking-wider font-medium">Total Workouts</p>
          </div>
          <div className="glass rounded-2xl border border-white/[0.04] p-4 text-center border-gradient hover:scale-[1.02] transition-transform duration-300">
            <p className="text-3xl font-display font-bold text-energy-400">
              {totalVolume > 1000
                ? `${(totalVolume / 1000).toFixed(1)}k`
                : totalVolume}
            </p>
            <p className="text-[10px] text-iron-400 mt-1.5 uppercase tracking-wider font-medium">Total Volume (kg)</p>
          </div>
        </div>
      )}

      {/* Workout list grouped by month */}
      {Object.entries(grouped).map(([month, monthWorkouts]) => (
        <div key={month} className="space-y-3">
          <h2 className="text-xs font-semibold text-iron-500 uppercase tracking-[0.15em] px-1 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-fire-500/50" />
            {month}
          </h2>
          <div className="space-y-3 stagger-children">
            {monthWorkouts.map((w) => (
              <WorkoutSummary
                key={w.id}
                workout={w}
                onDelete={deleteWorkout}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {workouts.length === 0 && (
        <div className="text-center py-16 card-enter">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl glass border-gradient flex items-center justify-center">
            <span className="text-4xl">📭</span>
          </div>
          <p className="text-iron-300 text-sm font-medium">No workout history yet</p>
          <p className="text-iron-500 text-xs mt-1">Complete your first workout to see it here.</p>
        </div>
      )}
    </div>
  );
}
