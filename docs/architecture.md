# Architecture

## Overview

IronLog follows a clean component-based architecture with unidirectional data flow through a centralized Zustand store.

## Component Hierarchy

```
App (Router)
├── Navbar
├── Home (page)
│   └── WorkoutSummary
├── NewWorkout (page)
│   └── WorkoutForm
│       └── ExerciseCard[]
│           └── SetRow[]
└── History (page)
    └── WorkoutSummary[]
```

## Design Principles

1. **Single source of truth** — All state lives in the Zustand store
2. **Memoized components** — `SetRow` and `ExerciseCard` use `React.memo` to prevent unnecessary re-renders
3. **Separation of concerns** — Pages handle routing/layout, components handle UI, store handles logic
4. **Persistence on save only** — localStorage is written only when the user explicitly saves, not on every keystroke

## Data Flow

```
User Input → Component → Store Action → State Update → React Re-render
                                       ↓ (on save)
                                  localStorage
```

## Key Files

| File | Responsibility |
|---|---|
| `src/app/store.ts` | All state management and business logic |
| `src/app/types.ts` | TypeScript type definitions |
| `src/utils/storage.ts` | localStorage read/write |
| `src/utils/templates.ts` | Pre-built workout templates |
