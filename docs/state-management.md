# State Management

## Why Zustand?

Zustand was chosen over Redux or Context API for several reasons:

| Feature | Zustand | Redux | Context API |
|---|---|---|---|
| Boilerplate | Minimal | Heavy | Moderate |
| Bundle size | ~1KB | ~7KB | 0 (built-in) |
| Re-render control | Selector-based | Requires memoization | Re-renders entire tree |
| Learning curve | Low | High | Low |
| DevTools | Yes (opt-in) | Yes | No |

## Store Structure

```ts
interface WorkoutState {
  workouts: WorkoutSession[];        // Saved history
  currentWorkout: WorkoutSession;    // Being built now

  // Workout lifecycle
  initCurrentWorkout: () => void;
  saveWorkout: () => void;
  deleteWorkout: (id: string) => void;
  loadFromStorage: () => void;

  // Exercise management
  addExercise: (name?: string) => void;
  removeExercise: (id: string) => void;
  updateExerciseName: (id: string, name: string) => void;

  // Set management
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, index: number) => void;
  updateSet: (exerciseId: string, index: number, field: keyof SetEntry, value: number) => void;

  // Metrics
  updateEnergyLevel: (level: number) => void;
  updatePumpLevel: (level: number) => void;
  updateNotes: (notes: string) => void;
  updateDuration: (minutes: number) => void;

  // Templates
  loadTemplateExercises: (exercises: {...}[]) => void;
}
```

## Design Decisions

1. **Persist on save, not on every keystroke** — Prevents excessive localStorage writes and keeps the app responsive
2. **Immutable updates** — All state mutations use spread operators to create new references
3. **Selector-based subscriptions** — Components only re-render when the specific slice they subscribe to changes
4. **No middleware** — Manual persistence via `loadFromStorage()` and `saveWorkout()` keeps control explicit
