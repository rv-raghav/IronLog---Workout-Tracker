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

  const handleUpdateSet = useCallback(
    (exerciseId: string, setIndex: number, field: keyof SetEntry, value: number) => {
      updateSet(exerciseId, setIndex, field, value);
    },
    [updateSet]
  );

  const handleSave = () => {
    if (currentWorkout.exercises.length === 0) return;
    saveWorkout();
    onSave?.();
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = workoutTemplates.find((t) => t.id === templateId);
    if (template) {
      loadTemplateExercises(template.exercises);
      setShowTemplates(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date display */}
      <div className="flex items-center gap-3 text-iron-300">
        <span className="text-2xl">📅</span>
        <div>
          <p className="text-sm text-iron-400">Today's Workout</p>
          <p className="text-lg font-display font-semibold text-iron-100">
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
          className="w-full flex items-center justify-between px-4 py-3 bg-iron-800 border border-iron-600/40 rounded-xl text-sm text-iron-200 hover:border-fire-500/40 transition-all"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">📋</span> Load Workout Template
          </span>
          <span className={`transition-transform duration-200 ${showTemplates ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>

        {showTemplates && (
          <div className="mt-2 space-y-1.5 animate-in slide-in-from-top-2">
            {workoutTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleLoadTemplate(t.id)}
                className="w-full text-left px-4 py-3 bg-iron-700/50 border border-iron-600/30 rounded-xl text-sm text-iron-200 hover:bg-iron-600/50 hover:border-fire-500/30 transition-all"
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-iron-400 text-xs block mt-0.5">
                  {t.exercises.length} exercises
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
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
        className="w-full py-3.5 border-2 border-dashed border-iron-500/40 rounded-2xl text-iron-400 hover:text-fire-400 hover:border-fire-500/40 transition-all text-sm font-medium flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span> Add Exercise
      </button>

      {/* Metrics section */}
      <div className="bg-iron-800 rounded-2xl border border-iron-600/40 p-5 space-y-5">
        <h3 className="text-base font-display font-semibold text-iron-100 flex items-center gap-2">
          <span>📊</span> Session Metrics
        </h3>

        {/* Energy level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-iron-300 flex items-center gap-2">
              ⚡ Energy Level
            </label>
            <span className="text-sm font-bold text-energy-400">
              {currentWorkout.energyLevel}/10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={currentWorkout.energyLevel}
            onChange={(e) => updateEnergyLevel(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-iron-600 accent-energy-500"
          />
        </div>

        {/* Pump level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-iron-300 flex items-center gap-2">
              💪 Pump Level
            </label>
            <span className="text-sm font-bold text-pump-400">
              {currentWorkout.pumpLevel}/10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={currentWorkout.pumpLevel}
            onChange={(e) => updatePumpLevel(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-iron-600 accent-pump-500"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm text-iron-300 flex items-center gap-2">
            ⏱️ Duration (minutes)
          </label>
          <input
            type="number"
            min={0}
            value={currentWorkout.totalDuration || ''}
            onChange={(e) => updateDuration(parseInt(e.target.value) || 0)}
            placeholder="60"
            className="w-full bg-iron-700 border border-iron-500/50 rounded-lg px-4 py-2.5 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/60 focus:ring-1 focus:ring-fire-500/30 transition-all"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm text-iron-300 flex items-center gap-2">
            📝 Notes
          </label>
          <textarea
            value={currentWorkout.notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="How did the session feel? Any PRs?"
            rows={3}
            className="w-full bg-iron-700 border border-iron-500/50 rounded-lg px-4 py-2.5 text-sm text-iron-100 placeholder-iron-500 focus:outline-none focus:border-fire-500/60 focus:ring-1 focus:ring-fire-500/30 transition-all resize-none"
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={currentWorkout.exercises.length === 0}
        className="w-full py-4 bg-gradient-to-r from-fire-600 to-fire-500 hover:from-fire-500 hover:to-fire-400 text-white font-display font-bold text-base rounded-2xl transition-all duration-300 shadow-lg shadow-fire-500/20 hover:shadow-fire-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        💾 Save Workout
      </button>
    </div>
  );
}
