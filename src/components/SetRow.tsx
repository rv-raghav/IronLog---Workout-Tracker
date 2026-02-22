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
    <div className="flex items-center gap-2.5 group animate-in">
      {/* Set number badge */}
      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-iron-600/60 text-iron-300 text-xs font-bold shrink-0 transition-colors group-hover:bg-iron-500/60">
        {index + 1}
      </span>

      {/* Weight input */}
      <div className="flex-1 min-w-0">
        <div className="relative group/input">
          <input
            type="number"
            min={0}
            step={2.5}
            value={set.weight || ''}
            onChange={(e) =>
              onUpdate(exerciseId, index, 'weight', parseFloat(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full bg-iron-700/60 border border-iron-500/30 rounded-xl px-3 py-2.5 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/50 focus:bg-iron-700/80 focus:ring-2 focus:ring-fire-500/10 transition-all duration-200"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-iron-500 pointer-events-none font-medium uppercase tracking-wider">
            kg
          </span>
        </div>
      </div>

      {/* × symbol */}
      <span className="text-iron-500 text-xs font-bold">×</span>

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
            className="w-full bg-iron-700/60 border border-iron-500/30 rounded-xl px-3 py-2.5 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/50 focus:bg-iron-700/80 focus:ring-2 focus:ring-fire-500/10 transition-all duration-200"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-iron-500 pointer-events-none font-medium uppercase tracking-wider">
            reps
          </span>
        </div>
      </div>

      {/* Remove button */}
      {canRemove ? (
        <button
          onClick={() => onRemove(exerciseId, index)}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-iron-600 hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100 shrink-0 press"
          aria-label="Remove set"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      ) : (
        <span className="w-8 shrink-0" />
      )}
    </div>
  );
});

export default SetRow;
