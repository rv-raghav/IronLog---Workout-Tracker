import { useEffect, useMemo, useState } from 'react';
import { useWorkoutStore } from '../app/store';

/** Derived data for one session of a specific exercise */
interface ExerciseSession {
  date: string;
  displayDate: string;
  workoutDay: string;
  sets: { weight: number; reps: number }[];
  bestSet: { weight: number; reps: number };
  totalVolume: number;
}

type ExerciseHistory = Record<string, ExerciseSession[]>;

export default function ExerciseProgress() {
  const { workouts, loadFromStorage } = useWorkoutStore();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const exerciseHistory = useMemo<ExerciseHistory>(() => {
    const history: ExerciseHistory = {};

    for (const workout of workouts) {
      const workoutDay = workout.exercises
        .map((e) => e.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(' · ');

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
          displayDate: new Date(workout.date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          workoutDay: workoutDay || 'Workout',
          sets: exercise.sets,
          bestSet,
          totalVolume,
        });
      }
    }

    for (const name of Object.keys(history)) {
      history[name].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return history;
  }, [workouts]);

  const exerciseNames = useMemo(
    () => Object.keys(exerciseHistory).sort(),
    [exerciseHistory]
  );

  function getVolumeDiff(sessions: ExerciseSession[], index: number): number | null {
    if (index >= sessions.length - 1) return null;
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
    <div className="page-enter space-y-6 bg-pattern min-h-full">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-hero">
          Exercise Progress
        </h1>
        <p className="text-xs text-iron-500 mt-1">
          Compare the same exercise across different workout days 📈
        </p>
      </div>

      {exerciseNames.length === 0 ? (
        <div className="text-center py-16 card-enter">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl glass border-gradient flex items-center justify-center">
            <span className="text-4xl">📈</span>
          </div>
          <p className="text-iron-300 text-sm font-medium">No data yet</p>
          <p className="text-iron-500 text-xs mt-1">Complete workouts to track exercise progress.</p>
        </div>
      ) : (
        <>
          {/* Exercise selector grid */}
          <div className="space-y-2.5">
            <label className="text-[10px] text-iron-500 font-semibold uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-fire-500/50" />
              Select an exercise
            </label>
            <div className="grid grid-cols-2 gap-2 stagger-children">
              {exerciseNames.map((name) => {
                const sessions = exerciseHistory[name];
                const isSelected = selectedExercise === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedExercise(isSelected ? null : name)}
                    className={`text-left px-3.5 py-3 rounded-xl border text-sm transition-all duration-300 press ${
                      isSelected
                        ? 'glass border-fire-500/30 text-fire-400 glow-fire'
                        : 'glass border-white/[0.04] text-iron-200 hover:border-white/[0.08]'
                    }`}
                  >
                    <span className="font-semibold block truncate text-[13px]">{name}</span>
                    <span className="text-[10px] text-iron-500 mt-0.5 block uppercase tracking-wider">
                      {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected exercise history */}
          {selectedExercise && selectedHistory.length > 0 && (
            <div className="space-y-4 card-enter">
              <h2 className="text-lg font-display font-semibold text-iron-100 flex items-center gap-2.5">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-fire-500 to-pump-500" />
                {selectedExercise}
                <span className="text-[10px] text-iron-500 font-normal uppercase tracking-wider ml-auto">
                  {selectedHistory.length} sessions
                </span>
              </h2>

              {/* Progress cards */}
              <div className="space-y-3 stagger-children">
                {selectedHistory.map((session, i) => {
                  const volumeDiff = getVolumeDiff(selectedHistory, i);
                  const weightDiff = getWeightDiff(selectedHistory, i);

                  return (
                    <div
                      key={session.date + i}
                      className="glass rounded-2xl border border-white/[0.04] p-4 space-y-3 hover:border-white/[0.08] transition-all duration-300"
                    >
                      {/* Date & workout context */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-iron-100">
                            {session.displayDate}
                          </p>
                          <p className="text-[10px] text-iron-500 truncate max-w-[200px] mt-0.5 uppercase tracking-wider">
                            {session.workoutDay}
                          </p>
                        </div>
                        {i === 0 && selectedHistory.length > 1 && (
                          <span className="text-[10px] px-2.5 py-1 rounded-lg bg-fire-500/15 text-fire-400 font-semibold uppercase tracking-wider border border-fire-500/20">
                            Latest
                          </span>
                        )}
                      </div>

                      {/* Sets grid */}
                      <div className="bg-iron-800/50 rounded-xl p-3 border border-white/[0.03]">
                        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1.5 text-xs">
                          <span className="text-iron-500 font-semibold text-[10px] uppercase tracking-wider">Set</span>
                          <span className="text-iron-500 font-semibold text-[10px] uppercase tracking-wider">Weight</span>
                          <span className="text-iron-500 font-semibold text-[10px] uppercase tracking-wider">Reps</span>
                          {session.sets.map((s, si) => (
                            <>
                              <span key={`n${si}`} className="text-iron-500">{si + 1}</span>
                              <span key={`w${si}`} className="text-iron-200 font-medium">{s.weight} kg</span>
                              <span key={`r${si}`} className="text-iron-200 font-medium">{s.reps}</span>
                            </>
                          ))}
                        </div>
                      </div>

                      {/* Stat badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[11px] text-iron-400 bg-iron-700/40 px-2.5 py-1 rounded-lg">
                          Vol: <span className="text-iron-200 font-medium">{session.totalVolume.toLocaleString()} kg</span>
                        </span>
                        <span className="text-[11px] text-iron-400 bg-iron-700/40 px-2.5 py-1 rounded-lg">
                          Best: <span className="text-iron-200 font-medium">{session.bestSet.weight}kg × {session.bestSet.reps}</span>
                        </span>

                        {volumeDiff !== null && (
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                              volumeDiff > 0
                                ? 'bg-success-500/10 text-success-400 border-success-500/20'
                                : volumeDiff < 0
                                ? 'bg-danger-500/10 text-danger-400 border-danger-500/20'
                                : 'bg-iron-600/30 text-iron-400 border-iron-500/20'
                            }`}
                          >
                            Vol {volumeDiff > 0 ? '↑' : volumeDiff < 0 ? '↓' : '='}{' '}
                            {Math.abs(volumeDiff).toLocaleString()} kg
                          </span>
                        )}

                        {weightDiff !== null && weightDiff !== 0 && (
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                              weightDiff > 0
                                ? 'bg-success-500/10 text-success-400 border-success-500/20'
                                : 'bg-danger-500/10 text-danger-400 border-danger-500/20'
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
