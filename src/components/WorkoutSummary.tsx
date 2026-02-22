import { memo, useState } from 'react';
import type { WorkoutSession } from '../app/types';

interface WorkoutSummaryProps {
  workout: WorkoutSession;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const WorkoutSummary = memo(function WorkoutSummary({
  workout,
  onDelete,
  compact = false,
}: WorkoutSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  const totalVolume = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  const displayDate = new Date(workout.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-iron-800 rounded-2xl border border-iron-600/40 overflow-hidden transition-all duration-300 hover:border-iron-500/50">
      {/* Header — always visible */}
      <button
        onClick={() => !compact && setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-start gap-3"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fire-500/20 to-pump-500/20 flex items-center justify-center text-xl shrink-0 mt-0.5">
          🏋️
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-iron-400">{displayDate}</p>
          <p className="text-iron-100 font-semibold text-base truncate">
            {workout.exercises.map((e) => e.name).filter(Boolean).join(', ') || 'Workout'}
          </p>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <span className="text-xs text-iron-400 flex items-center gap-1">
              🎯 {workout.exercises.length} exercises
            </span>
            <span className="text-xs text-iron-400 flex items-center gap-1">
              📦 {totalSets} sets
            </span>
            {totalVolume > 0 && (
              <span className="text-xs text-iron-400 flex items-center gap-1">
                💪 {totalVolume.toLocaleString()} kg
              </span>
            )}
            {workout.totalDuration > 0 && (
              <span className="text-xs text-iron-400 flex items-center gap-1">
                ⏱️ {workout.totalDuration} min
              </span>
            )}
          </div>
        </div>
        {!compact && (
          <span
            className={`text-iron-500 transition-transform duration-200 mt-1 ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            ▾
          </span>
        )}
      </button>

      {/* Expanded content */}
      {expanded && !compact && (
        <div className="px-4 pb-4 border-t border-iron-700/50 pt-3 space-y-4">
          {/* Metrics badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-energy-500/10 text-energy-400 text-xs font-medium">
              ⚡ Energy: {workout.energyLevel}/10
            </span>
            <span className="px-3 py-1 rounded-full bg-pump-500/10 text-pump-400 text-xs font-medium">
              💪 Pump: {workout.pumpLevel}/10
            </span>
          </div>

          {/* Exercise details */}
          {workout.exercises.map((ex) => (
            <div key={ex.id} className="space-y-1.5">
              <h4 className="text-sm font-semibold text-iron-200">{ex.name || 'Unnamed'}</h4>
              <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-xs text-iron-400 pl-2">
                <span className="font-medium">Set</span>
                <span className="font-medium">Weight</span>
                <span className="font-medium">Reps</span>
                {ex.sets.map((s, i) => (
                  <>
                    <span key={`n-${i}`} className="text-iron-500">{i + 1}</span>
                    <span key={`w-${i}`} className="text-iron-200">{s.weight} kg</span>
                    <span key={`r-${i}`} className="text-iron-200">{s.reps}</span>
                  </>
                ))}
              </div>
            </div>
          ))}

          {/* Notes */}
          {workout.notes && (
            <div className="bg-iron-700/40 rounded-xl px-4 py-3">
              <p className="text-xs text-iron-400 mb-1">📝 Notes</p>
              <p className="text-sm text-iron-200">{workout.notes}</p>
            </div>
          )}

          {/* Delete */}
          {onDelete && (
            <button
              onClick={() => onDelete(workout.id)}
              className="text-xs text-danger-400 hover:text-danger-300 mt-2 flex items-center gap-1 transition-colors"
            >
              🗑️ Delete workout
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default WorkoutSummary;
