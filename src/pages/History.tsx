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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-iron-100">
          📊 History
        </h1>
        {workouts.length > 0 && (
          <button
            onClick={() => exportWorkoutsToJSON(workouts)}
            className="px-3 py-1.5 text-xs bg-iron-700 border border-iron-600/50 rounded-lg text-iron-300 hover:text-iron-100 hover:border-iron-500 transition-all"
          >
            📥 Export JSON
          </button>
        )}
      </div>

      {/* Stats bar */}
      {workouts.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-iron-800 rounded-2xl border border-iron-600/40 p-4 text-center">
            <p className="text-2xl font-display font-bold text-fire-400">
              {workouts.length}
            </p>
            <p className="text-xs text-iron-400 mt-1">Total Workouts</p>
          </div>
          <div className="bg-iron-800 rounded-2xl border border-iron-600/40 p-4 text-center">
            <p className="text-2xl font-display font-bold text-energy-400">
              {totalVolume > 1000
                ? `${(totalVolume / 1000).toFixed(1)}k`
                : totalVolume}
            </p>
            <p className="text-xs text-iron-400 mt-1">Total Volume (kg)</p>
          </div>
        </div>
      )}

      {/* Workout list grouped by month */}
      {Object.entries(grouped).map(([month, monthWorkouts]) => (
        <div key={month} className="space-y-3">
          <h2 className="text-sm font-semibold text-iron-400 uppercase tracking-wider px-1">
            {month}
          </h2>
          <div className="space-y-3">
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
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-iron-400 text-sm">
            No workout history yet.
          </p>
          <p className="text-iron-500 text-xs mt-1">
            Complete your first workout to see it here.
          </p>
        </div>
      )}
    </div>
  );
}
