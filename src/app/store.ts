import { create } from 'zustand';
import { format } from 'date-fns';
import type { Exercise, SetEntry, WorkoutSession } from './types';
import { loadWorkouts, saveWorkouts } from '../utils/storage';

/** Generate a unique ID */
const uid = (): string => crypto.randomUUID();

interface WorkoutState {
  // Saved workout history
  workouts: WorkoutSession[];

  // Current workout being built
  currentWorkout: WorkoutSession;

  // Actions
  initCurrentWorkout: () => void;
  addExercise: (name?: string) => void;
  removeExercise: (exerciseId: string) => void;
  updateExerciseName: (exerciseId: string, name: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  updateSet: (exerciseId: string, setIndex: number, field: keyof SetEntry, value: number) => void;
  updateEnergyLevel: (level: number) => void;
  updatePumpLevel: (level: number) => void;
  updateNotes: (notes: string) => void;
  updateDuration: (minutes: number) => void;
  saveWorkout: () => void;
  deleteWorkout: (id: string) => void;
  loadFromStorage: () => void;
  loadTemplateExercises: (exercises: { name: string; defaultSets: number }[]) => void;
}

/** Create a fresh empty workout session for today */
function createEmptyWorkout(): WorkoutSession {
  return {
    id: uid(),
    date: format(new Date(), 'yyyy-MM-dd'),
    exercises: [],
    energyLevel: 5,
    pumpLevel: 5,
    notes: '',
    totalDuration: 0,
  };
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  currentWorkout: createEmptyWorkout(),

  initCurrentWorkout: () => {
    set({ currentWorkout: createEmptyWorkout() });
  },

  addExercise: (name = '') => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: [
          ...state.currentWorkout.exercises,
          { id: uid(), name, sets: [{ weight: 0, reps: 0 }] } as Exercise,
        ],
      },
    }));
  },

  removeExercise: (exerciseId) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.filter((e) => e.id !== exerciseId),
      },
    }));
  },

  updateExerciseName: (exerciseId, name) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map((e) =>
          e.id === exerciseId ? { ...e, name } : e
        ),
      },
    }));
  },

  addSet: (exerciseId) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map((e) =>
          e.id === exerciseId
            ? { ...e, sets: [...e.sets, { weight: 0, reps: 0 }] }
            : e
        ),
      },
    }));
  },

  removeSet: (exerciseId, setIndex) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map((e) =>
          e.id === exerciseId
            ? { ...e, sets: e.sets.filter((_, i) => i !== setIndex) }
            : e
        ),
      },
    }));
  },

  updateSet: (exerciseId, setIndex, field, value) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map((e) =>
          e.id === exerciseId
            ? {
                ...e,
                sets: e.sets.map((s, i) =>
                  i === setIndex ? { ...s, [field]: value } : s
                ),
              }
            : e
        ),
      },
    }));
  },

  updateEnergyLevel: (level) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, energyLevel: level },
    }));
  },

  updatePumpLevel: (level) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, pumpLevel: level },
    }));
  },

  updateNotes: (notes) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, notes },
    }));
  },

  updateDuration: (minutes) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, totalDuration: minutes },
    }));
  },

  saveWorkout: () => {
    const { currentWorkout, workouts } = get();

    // Validate: must have at least one exercise
    if (currentWorkout.exercises.length === 0) return;

    const updated = [currentWorkout, ...workouts];
    saveWorkouts(updated);
    set({
      workouts: updated,
      currentWorkout: createEmptyWorkout(),
    });
  },

  deleteWorkout: (id) => {
    const updated = get().workouts.filter((w) => w.id !== id);
    saveWorkouts(updated);
    set({ workouts: updated });
  },

  loadFromStorage: () => {
    const workouts = loadWorkouts();
    set({ workouts });
  },

  loadTemplateExercises: (exercises) => {
    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exercises: exercises.map((ex) => ({
          id: uid(),
          name: ex.name,
          sets: Array.from({ length: ex.defaultSets }, () => ({ weight: 0, reps: 0 })),
        })),
      },
    }));
  },
}));
