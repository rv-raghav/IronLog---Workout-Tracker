import { memo } from 'react';
import type { SetEntry } from '../app/types';

interface SetRowProps {
  exerciseId: string;
  index: number;
  set: SetEntry;
  onUpdate: (exerciseId: string, setIndex: number, field: keyof SetEntry, value: number) => void;
  onRemove: (exerciseId: string, setIndex: number) => void;
  canRemove: boolean;
}

const SetRow = memo(function SetRow({
  exerciseId,
  index,
  set,
  onUpdate,
  onRemove,
  canRemove,
}: SetRowProps) {
  return (
    <div className="flex items-center gap-3 group">
      {/* Set number badge */}
      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-iron-600 text-iron-300 text-xs font-bold shrink-0">
        {index + 1}
      </span>

      {/* Weight input */}
      <div className="flex-1 min-w-0">
        <div className="relative">
          <input
            type="number"
            min={0}
            step={2.5}
            value={set.weight || ''}
            onChange={(e) =>
              onUpdate(exerciseId, index, 'weight', parseFloat(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full bg-iron-700 border border-iron-500/50 rounded-lg px-3 py-2 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/60 focus:ring-1 focus:ring-fire-500/30 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-iron-500 pointer-events-none">
            kg
          </span>
        </div>
      </div>

      {/* Reps input */}
      <div className="flex-1 min-w-0">
        <div className="relative">
          <input
            type="number"
            min={0}
            value={set.reps || ''}
            onChange={(e) =>
              onUpdate(exerciseId, index, 'reps', parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full bg-iron-700 border border-iron-500/50 rounded-lg px-3 py-2 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/60 focus:ring-1 focus:ring-fire-500/30 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-iron-500 pointer-events-none">
            reps
          </span>
        </div>
      </div>

      {/* Remove button */}
      {canRemove && (
        <button
          onClick={() => onRemove(exerciseId, index)}
          className="w-7 h-7 flex items-center justify-center rounded-full text-iron-500 hover:text-danger-400 hover:bg-danger-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
          aria-label="Remove set"
        >
          ✕
        </button>
      )}
    </div>
  );
});

export default SetRow;
