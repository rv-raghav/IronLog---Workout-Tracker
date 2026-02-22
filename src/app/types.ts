/** A single set within an exercise */
export type SetEntry = {
  weight: number;
  reps: number;
};

/** An exercise containing multiple sets */
export type Exercise = {
  id: string;
  name: string;
  sets: SetEntry[];
};

/** A complete workout session */
export type WorkoutSession = {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  exercises: Exercise[];
  energyLevel: number; // 1–10
  pumpLevel: number;   // 1–10
  notes: string;
  totalDuration: number; // minutes
};

/** Template for pre-filling exercises from the workout plan */
export type ExerciseTemplate = {
  name: string;
  defaultSets: number;
  defaultReps: string; // e.g. "8-10"
};

/** Workout day template */
export type WorkoutDayTemplate = {
  id: string;
  name: string;
  exercises: ExerciseTemplate[];
};
