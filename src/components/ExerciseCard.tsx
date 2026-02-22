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
    <div className="bg-iron-800 rounded-2xl border border-iron-600/40 overflow-hidden transition-all duration-300 hover:border-iron-500/60">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fire-500/20 to-pump-500/20 flex items-center justify-center text-fire-400 text-lg shrink-0">
          💪
        </div>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onUpdateName(exercise.id, e.target.value)}
          placeholder="Exercise name..."
          className="flex-1 bg-transparent text-iron-100 font-semibold text-base placeholder-iron-500 focus:outline-none border-b border-transparent focus:border-fire-500/40 transition-all pb-1"
        />
        <button
          onClick={() => onRemoveExercise(exercise.id)}
          className="text-iron-500 hover:text-danger-400 transition-colors text-sm px-2 py-1 rounded-lg hover:bg-danger-500/10"
          aria-label="Remove exercise"
        >
          🗑️
        </button>
      </div>

      {/* Column labels */}
      <div className="flex items-center gap-3 px-4 py-1 text-xs text-iron-400 uppercase tracking-wider">
        <span className="w-7 shrink-0">Set</span>
        <span className="flex-1">Weight</span>
        <span className="flex-1">Reps</span>
        <span className="w-7 shrink-0" />
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
      <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-iron-700/50">
        <button
          onClick={() => onAddSet(exercise.id)}
          className="text-sm text-fire-400 hover:text-fire-300 font-medium flex items-center gap-1.5 transition-colors"
        >
          <span className="text-base">+</span> Add Set
        </button>
        {totalVolume > 0 && (
          <span className="text-xs text-iron-400">
            Vol: <span className="text-iron-200 font-medium">{totalVolume.toLocaleString()} kg</span>
          </span>
        )}
      </div>
    </div>
  );
});

export default ExerciseCard;
