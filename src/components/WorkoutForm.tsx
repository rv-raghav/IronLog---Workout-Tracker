import { useCallback, useState } from 'react';
import { useWorkoutStore } from '../app/store';
import { workoutTemplates } from '../utils/templates';
import ExerciseCard from './ExerciseCard';
import type { SetEntry } from '../app/types';

export default function WorkoutForm({ onSave }: { onSave?: () => void }) {
  const {
    currentWorkout,
    addExercise,
    removeExercise,
    updateExerciseName,
    addSet,
    removeSet,
    updateSet,
    updateEnergyLevel,
    updatePumpLevel,
    updateNotes,
    updateDuration,
    saveWorkout,
    loadTemplateExercises,
  } = useWorkoutStore();

  const [showTemplates, setShowTemplates] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleUpdateSet = useCallback(
    (exerciseId: string, setIndex: number, field: keyof SetEntry, value: number) => {
      updateSet(exerciseId, setIndex, field, value);
    },
    [updateSet]
  );

  const handleSave = () => {
    if (currentWorkout.exercises.length === 0) return;
    saveWorkout();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setTimeout(() => onSave?.(), 800);
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = workoutTemplates.find((t) => t.id === templateId);
    if (template) {
      loadTemplateExercises(template.exercises);
      setShowTemplates(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] toast-enter">
          <div className="glass rounded-2xl px-5 py-3 border border-success-500/20 glow-fire flex items-center gap-2.5 shadow-2xl">
            <span className="text-lg">✅</span>
            <span className="text-sm font-medium text-iron-100">Workout saved!</span>
          </div>
        </div>
      )}

      {/* Date display */}
      <div className="glass rounded-2xl p-4 border border-white/[0.04] flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fire-500/20 to-pump-500/10 flex items-center justify-center text-2xl border border-white/[0.04]">
          📅
        </div>
        <div>
          <p className="text-[10px] text-iron-500 uppercase tracking-[0.15em] font-semibold">Today's Workout</p>
          <p className="text-lg font-display font-semibold text-iron-100 mt-0.5">
            {new Date(currentWorkout.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Template selector */}
      <div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-full flex items-center justify-between px-4 py-3.5 glass border border-white/[0.04] rounded-2xl text-sm text-iron-200 hover:border-white/[0.08] transition-all duration-300 press"
        >
          <span className="flex items-center gap-2.5">
            <span className="text-lg">📋</span>
            <span className="font-medium">Load Workout Template</span>
          </span>
          <span className={`transition-transform duration-300 text-iron-500 text-xs ${showTemplates ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>

        {showTemplates && (
          <div className="mt-2 space-y-1.5 expand-enter stagger-children">
            {workoutTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleLoadTemplate(t.id)}
                className="w-full text-left px-4 py-3.5 glass border border-white/[0.03] rounded-xl text-sm text-iron-200 hover:border-fire-500/20 hover:bg-fire-500/5 transition-all duration-200 press"
              >
                <span className="font-semibold">{t.name}</span>
                <span className="text-iron-500 text-xs block mt-0.5">
                  {t.exercises.length} exercises · {t.exercises.reduce((s, e) => s + e.defaultSets, 0)} sets
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-4 stagger-children">
        {currentWorkout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateName={updateExerciseName}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onUpdateSet={handleUpdateSet}
            onRemoveExercise={removeExercise}
          />
        ))}
      </div>

      {/* Add exercise button */}
      <button
        onClick={() => addExercise()}
        className="w-full py-4 border-2 border-dashed border-iron-600/30 rounded-2xl text-iron-400 hover:text-fire-400 hover:border-fire-500/30 hover:bg-fire-500/5 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 press"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 3v10M3 8h10" />
        </svg>
        Add Exercise
      </button>

      {/* Metrics section */}
      <div className="glass rounded-2xl border border-white/[0.04] p-5 space-y-6">
        <h3 className="text-base font-display font-semibold text-iron-100 flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-fire-500 to-pump-500" />
          Session Metrics
        </h3>

        {/* Energy level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-iron-300 flex items-center gap-2 font-medium">
              ⚡ Energy Level
            </label>
            <span className="text-sm font-bold text-energy-400 bg-energy-500/10 px-2.5 py-0.5 rounded-lg border border-energy-500/20">
              {currentWorkout.energyLevel}/10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={currentWorkout.energyLevel}
            onChange={(e) => updateEnergyLevel(parseInt(e.target.value))}
            className="w-full energy-slider"
          />
        </div>

        {/* Pump level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-iron-300 flex items-center gap-2 font-medium">
              💪 Pump Level
            </label>
            <span className="text-sm font-bold text-pump-400 bg-pump-500/10 px-2.5 py-0.5 rounded-lg border border-pump-500/20">
              {currentWorkout.pumpLevel}/10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={currentWorkout.pumpLevel}
            onChange={(e) => updatePumpLevel(parseInt(e.target.value))}
            className="w-full pump-slider"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm text-iron-300 flex items-center gap-2 font-medium">
            ⏱️ Duration (minutes)
          </label>
          <input
            type="number"
            min={0}
            value={currentWorkout.totalDuration || ''}
            onChange={(e) => updateDuration(parseInt(e.target.value) || 0)}
            placeholder="60"
            className="w-full bg-iron-700/60 border border-iron-500/30 rounded-xl px-4 py-3 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/50 focus:ring-2 focus:ring-fire-500/10 transition-all duration-200"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm text-iron-300 flex items-center gap-2 font-medium">
            📝 Notes
          </label>
          <textarea
            value={currentWorkout.notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="How did the session feel? Any PRs?"
            rows={3}
            className="w-full bg-iron-700/60 border border-iron-500/30 rounded-xl px-4 py-3 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/50 focus:ring-2 focus:ring-fire-500/10 transition-all duration-200 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={currentWorkout.exercises.length === 0}
        className="w-full py-4.5 bg-gradient-to-r from-fire-600 via-fire-500 to-fire-400 text-white font-display font-bold text-base rounded-2xl transition-all duration-300 pulse-glow hover:scale-[1.01] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none press relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          💾 Save Workout
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </button>
    </div>
  );
}
