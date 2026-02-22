# Data Model

## Core Types

### SetEntry

A single set within an exercise:

```ts
type SetEntry = {
  weight: number;  // Weight in kg
  reps: number;    // Number of repetitions
};
```

### Exercise

A named exercise containing multiple sets:

```ts
type Exercise = {
  id: string;        // UUID
  name: string;      // e.g. "Bench Press"
  sets: SetEntry[];  // Array of weight/rep entries
};
```

### WorkoutSession

A complete workout for one day:

```ts
type WorkoutSession = {
  id: string;           // UUID
  date: string;         // ISO date "YYYY-MM-DD"
  exercises: Exercise[];
  energyLevel: number;  // 1–10
  pumpLevel: number;    // 1–10
  notes: string;
  totalDuration: number; // Minutes
};
```

### ExerciseTemplate & WorkoutDayTemplate

Templates for pre-filling workouts from the PPL plan:

```ts
type ExerciseTemplate = {
  name: string;
  defaultSets: number;
  defaultReps: string; // e.g. "8-10"
};

type WorkoutDayTemplate = {
  id: string;
  name: string;
  exercises: ExerciseTemplate[];
};
```

## Storage Format

All `WorkoutSession[]` data is stored in localStorage as a JSON string under the key `iron-log-workouts`.
