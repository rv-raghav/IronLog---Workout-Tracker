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
    <div className="glass rounded-2xl border border-white/[0.04] overflow-hidden transition-all duration-300 hover:border-white/[0.08]">
      {/* Header — always visible */}
      <button
        onClick={() => !compact && setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-start gap-3.5 press"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fire-500/15 to-pump-500/10 flex items-center justify-center text-xl shrink-0 mt-0.5 border border-white/[0.04]">
          🏋️
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-iron-500 font-medium tracking-wider uppercase">{displayDate}</p>
          <p className="text-iron-100 font-semibold text-[15px] truncate mt-0.5">
            {workout.exercises.map((e) => e.name).filter(Boolean).join(' · ') || 'Workout'}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-[11px] text-iron-400 flex items-center gap-1 bg-iron-700/40 px-2 py-0.5 rounded-md">
              🎯 {workout.exercises.length} exercises
            </span>
            <span className="text-[11px] text-iron-400 flex items-center gap-1 bg-iron-700/40 px-2 py-0.5 rounded-md">
              📦 {totalSets} sets
            </span>
            {totalVolume > 0 && (
              <span className="text-[11px] text-iron-400 flex items-center gap-1 bg-iron-700/40 px-2 py-0.5 rounded-md">
                💪 {totalVolume.toLocaleString()} kg
              </span>
            )}
            {workout.totalDuration > 0 && (
              <span className="text-[11px] text-iron-400 flex items-center gap-1 bg-iron-700/40 px-2 py-0.5 rounded-md">
                ⏱️ {workout.totalDuration} min
              </span>
            )}
          </div>
        </div>
        {!compact && (
          <span
            className={`text-iron-500 transition-transform duration-300 mt-2 text-sm ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            ▾
          </span>
        )}
      </button>

      {/* Expanded content */}
      {expanded && !compact && (
        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-4 expand-enter">
          {/* Metrics badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-energy-500/10 text-energy-400 text-xs font-medium border border-energy-500/20 glow-energy">
              ⚡ Energy: {workout.energyLevel}/10
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-pump-500/10 text-pump-400 text-xs font-medium border border-pump-500/20 glow-pump">
              💪 Pump: {workout.pumpLevel}/10
            </span>
          </div>

          {/* Exercise details */}
          <div className="space-y-3">
            {workout.exercises.map((ex) => (
              <div key={ex.id} className="bg-iron-800/50 rounded-xl p-3 border border-white/[0.03]">
                <h4 className="text-sm font-semibold text-iron-200 mb-2">{ex.name || 'Unnamed'}</h4>
                <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-xs text-iron-400">
                  <span className="font-semibold text-iron-500">Set</span>
                  <span className="font-semibold text-iron-500">Weight</span>
                  <span className="font-semibold text-iron-500">Reps</span>
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
          </div>

          {/* Notes */}
          {workout.notes && (
            <div className="bg-iron-700/30 rounded-xl px-4 py-3 border border-white/[0.03]">
              <p className="text-[10px] text-iron-500 mb-1 uppercase tracking-wider font-semibold">📝 Notes</p>
              <p className="text-sm text-iron-300 leading-relaxed">{workout.notes}</p>
            </div>
          )}

          {/* Delete */}
          {onDelete && (
            <button
              onClick={() => onDelete(workout.id)}
              className="text-xs text-danger-500/70 hover:text-danger-400 flex items-center gap-1.5 transition-all duration-200 px-2 py-1.5 rounded-lg hover:bg-danger-500/10 press"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" />
              </svg>
              Delete workout
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default WorkoutSummary;
