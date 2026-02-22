import { memo } from 'react';
import type { Exercise, SetEntry } from '../app/types';
import SetRow from './SetRow';

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdateName: (exerciseId: string, name: string) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setIndex: number) => void;
  onUpdateSet: (exerciseId: string, setIndex: number, field: keyof SetEntry, value: number) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

const ExerciseCard = memo(function ExerciseCard({
  exercise,
  onUpdateName,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onRemoveExercise,
}: ExerciseCardProps) {
  const totalVolume = exercise.sets.reduce(
    (sum, s) => sum + s.weight * s.reps,
    0
  );

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.1] border border-white/[0.04] group/card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fire-500/20 to-pump-500/15 flex items-center justify-center text-fire-400 text-lg shrink-0 group-hover/card:from-fire-500/30 group-hover/card:to-pump-500/25 transition-all duration-300">
          💪
        </div>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onUpdateName(exercise.id, e.target.value)}
          placeholder="Exercise name..."
          className="flex-1 bg-transparent text-iron-100 font-semibold text-base placeholder-iron-500 focus:outline-none border-b border-transparent focus:border-fire-500/30 transition-all pb-1"
        />
        <button
          onClick={() => onRemoveExercise(exercise.id)}
          className="text-iron-600 hover:text-danger-400 transition-all duration-200 p-2 rounded-xl hover:bg-danger-500/10 press"
          aria-label="Remove exercise"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" />
          </svg>
        </button>
      </div>

      {/* Column labels */}
      <div className="flex items-center gap-2.5 px-4 py-1.5 text-[10px] text-iron-500 uppercase tracking-[0.15em] font-semibold">
        <span className="w-7 shrink-0">Set</span>
        <span className="flex-1">Weight</span>
        <span className="w-3 shrink-0" />
        <span className="flex-1">Reps</span>
        <span className="w-8 shrink-0" />
      </div>

      {/* Sets */}
      <div className="px-4 pb-2 space-y-2">
        {exercise.sets.map((s, i) => (
          <SetRow
            key={i}
            exerciseId={exercise.id}
            index={i}
            set={s}
            onUpdate={onUpdateSet}
            onRemove={onRemoveSet}
            canRemove={exercise.sets.length > 1}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-white/[0.04]">
        <button
          onClick={() => onAddSet(exercise.id)}
          className="text-sm text-fire-400 hover:text-fire-300 font-medium flex items-center gap-1.5 transition-all duration-200 press px-2 py-1 -ml-2 rounded-lg hover:bg-fire-500/10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 3v8M3 7h8" />
          </svg>
          Add Set
        </button>
        {totalVolume > 0 && (
          <span className="text-xs text-iron-500 px-2.5 py-1 rounded-lg bg-iron-700/40">
            <span className="text-iron-300 font-medium">{totalVolume.toLocaleString()}</span> kg total
          </span>
        )}
      </div>
    </div>
  );
});

export default ExerciseCard;
