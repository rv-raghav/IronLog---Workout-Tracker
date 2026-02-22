import { useEffect, useMemo, useState } from 'react';
import { useWorkoutStore } from '../app/store';

/** Derived data for one session of a specific exercise */
interface ExerciseSession {
  date: string;
  displayDate: string;
  workoutDay: string; // e.g. "Lat Pulldown, Seated Row, ..." to identify which workout
  sets: { weight: number; reps: number }[];
  bestSet: { weight: number; reps: number };
  totalVolume: number;
}

/** All sessions grouped by exercise name */
type ExerciseHistory = Record<string, ExerciseSession[]>;

export default function ExerciseProgress() {
  const { workouts, loadFromStorage } = useWorkoutStore();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Group all exercises by name across all workouts
  const exerciseHistory = useMemo<ExerciseHistory>(() => {
    const history: ExerciseHistory = {};

    for (const workout of workouts) {
      const workoutDay = workout.exercises
        .map((e) => e.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(', ');

      for (const exercise of workout.exercises) {
        if (!exercise.name) continue;
        const name = exercise.name.trim();
        if (!history[name]) history[name] = [];

        const totalVolume = exercise.sets.reduce(
          (sum, s) => sum + s.weight * s.reps,
          0
        );
        const bestSet = exercise.sets.reduce(
          (best, s) => (s.weight > best.weight ? s : best),
          { weight: 0, reps: 0 }
        );

        history[name].push({
          date: workout.date,
          displayDate: new Date(workout.date + 'T00:00:00').toLocaleDateString(
            'en-US',
            { month: 'short', day: 'numeric' }
          ),
          workoutDay: workoutDay || 'Workout',
          sets: exercise.sets,
          bestSet,
          totalVolume,
        });
      }
    }

    // Sort each exercise's sessions by date (newest first)
    for (const name of Object.keys(history)) {
      history[name].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return history;
  }, [workouts]);

  // All exercise names sorted alphabetically
  const exerciseNames = useMemo(
    () => Object.keys(exerciseHistory).sort(),
    [exerciseHistory]
  );

  // Calculate diff between consecutive sessions
  function getVolumeDiff(sessions: ExerciseSession[], index: number): number | null {
    if (index >= sessions.length - 1) return null; // no previous session to compare
    const current = sessions[index].totalVolume;
    const previous = sessions[index + 1].totalVolume;
    if (previous === 0) return null;
    return current - previous;
  }

  function getWeightDiff(sessions: ExerciseSession[], index: number): number | null {
    if (index >= sessions.length - 1) return null;
    return sessions[index].bestSet.weight - sessions[index + 1].bestSet.weight;
  }

  const selectedHistory = selectedExercise
    ? exerciseHistory[selectedExercise] || []
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-iron-100">
        📈 Exercise Progress
      </h1>
      <p className="text-sm text-iron-400">
        Compare the same exercise across different workout days — see how your
        Lat Pulldowns, Seated Rows, etc. progress over time.
      </p>

      {exerciseNames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-iron-400 text-sm">
            No workout data yet. Complete a workout to see progress here.
          </p>
        </div>
      ) : (
        <>
          {/* Exercise selector grid */}
          <div className="space-y-2">
            <label className="text-sm text-iron-300 font-medium">
              Select an exercise
            </label>
            <div className="grid grid-cols-2 gap-2">
              {exerciseNames.map((name) => {
                const sessions = exerciseHistory[name];
                const isSelected = selectedExercise === name;
                return (
                  <button
                    key={name}
                    onClick={() =>
                      setSelectedExercise(isSelected ? null : name)
                    }
                    className={`text-left px-3 py-3 rounded-xl border text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-fire-500/15 border-fire-500/50 text-fire-400'
                        : 'bg-iron-800 border-iron-600/40 text-iron-200 hover:border-iron-500'
                    }`}
                  >
                    <span className="font-medium block truncate">{name}</span>
                    <span className="text-xs text-iron-500 mt-0.5 block">
                      {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected exercise history */}
          {selectedExercise && selectedHistory.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-semibold text-iron-100 flex items-center gap-2">
                💪 {selectedExercise}
                <span className="text-xs text-iron-500 font-normal">
                  ({selectedHistory.length} sessions)
                </span>
              </h2>

              {/* Progress cards */}
              <div className="space-y-3">
                {selectedHistory.map((session, i) => {
                  const volumeDiff = getVolumeDiff(selectedHistory, i);
                  const weightDiff = getWeightDiff(selectedHistory, i);

                  return (
                    <div
                      key={session.date + i}
                      className="bg-iron-800 rounded-2xl border border-iron-600/40 p-4 space-y-3"
                    >
                      {/* Date & workout context */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-iron-100">
                            {session.displayDate}
                          </p>
                          <p className="text-xs text-iron-500 truncate max-w-[200px]">
                            {session.workoutDay}
                          </p>
                        </div>
                        {i === 0 && selectedHistory.length > 1 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-fire-500/15 text-fire-400 font-medium">
                            Latest
                          </span>
                        )}
                      </div>

                      {/* Sets grid */}
                      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-xs pl-1">
                        <span className="text-iron-500 font-medium">Set</span>
                        <span className="text-iron-500 font-medium">Weight</span>
                        <span className="text-iron-500 font-medium">Reps</span>
                        {session.sets.map((s, si) => (
                          <>
                            <span key={`n${si}`} className="text-iron-500">{si + 1}</span>
                            <span key={`w${si}`} className="text-iron-200">{s.weight} kg</span>
                            <span key={`r${si}`} className="text-iron-200">{s.reps}</span>
                          </>
                        ))}
                      </div>

                      {/* Comparison badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-xs text-iron-400">
                          Vol: <span className="text-iron-200 font-medium">{session.totalVolume.toLocaleString()} kg</span>
                        </span>
                        <span className="text-xs text-iron-400">
                          Best: <span className="text-iron-200 font-medium">{session.bestSet.weight} kg × {session.bestSet.reps}</span>
                        </span>

                        {volumeDiff !== null && (
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              volumeDiff > 0
                                ? 'bg-success-500/15 text-success-400'
                                : volumeDiff < 0
                                ? 'bg-danger-500/15 text-danger-400'
                                : 'bg-iron-600/30 text-iron-400'
                            }`}
                          >
                            Vol {volumeDiff > 0 ? '↑' : volumeDiff < 0 ? '↓' : '='}{' '}
                            {Math.abs(volumeDiff).toLocaleString()} kg
                          </span>
                        )}

                        {weightDiff !== null && weightDiff !== 0 && (
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              weightDiff > 0
                                ? 'bg-success-500/15 text-success-400'
                                : 'bg-danger-500/15 text-danger-400'
                            }`}
                          >
                            Top {weightDiff > 0 ? '↑' : '↓'} {Math.abs(weightDiff)} kg
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
