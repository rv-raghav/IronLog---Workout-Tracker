import { describe, it, expect, beforeEach } from 'vitest';
import { useWorkoutStore } from '../app/store';

// Reset store before each test
beforeEach(() => {
  useWorkoutStore.setState({
    workouts: [],
    currentWorkout: {
      id: 'test-id',
      date: '2026-02-22',
      exercises: [],
      energyLevel: 5,
      pumpLevel: 5,
      notes: '',
      totalDuration: 0,
    },
  });
  localStorage.clear();
});

describe('WorkoutStore', () => {
  it('should initialize with empty state', () => {
    const state = useWorkoutStore.getState();
    expect(state.workouts).toHaveLength(0);
    expect(state.currentWorkout.exercises).toHaveLength(0);
  });

  it('should add an exercise', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Bench Press');
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises).toHaveLength(1);
    expect(state.currentWorkout.exercises[0].name).toBe('Bench Press');
    expect(state.currentWorkout.exercises[0].sets).toHaveLength(1);
  });

  it('should add multiple exercises', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Bench Press');
    store.addExercise('Squat');
    store.addExercise('Deadlift');
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises).toHaveLength(3);
    expect(state.currentWorkout.exercises[0].name).toBe('Bench Press');
    expect(state.currentWorkout.exercises[1].name).toBe('Squat');
    expect(state.currentWorkout.exercises[2].name).toBe('Deadlift');
  });

  it('should remove an exercise', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Bench Press');
    store.addExercise('Squat');

    const exerciseId = useWorkoutStore.getState().currentWorkout.exercises[0].id;
    store.removeExercise(exerciseId);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises).toHaveLength(1);
    expect(state.currentWorkout.exercises[0].name).toBe('Squat');
  });

  it('should update exercise name', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Bench');

    const exerciseId = useWorkoutStore.getState().currentWorkout.exercises[0].id;
    store.updateExerciseName(exerciseId, 'Bench Press');
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises[0].name).toBe('Bench Press');
  });

  it('should add a set to an exercise', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Squat');

    const exerciseId = useWorkoutStore.getState().currentWorkout.exercises[0].id;
    store.addSet(exerciseId);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises[0].sets).toHaveLength(2);
  });

  it('should remove a set from an exercise', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Squat');

    const exerciseId = useWorkoutStore.getState().currentWorkout.exercises[0].id;
    store.addSet(exerciseId);
    store.removeSet(exerciseId, 0);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises[0].sets).toHaveLength(1);
  });

  it('should update a set', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Bench Press');

    const exerciseId = useWorkoutStore.getState().currentWorkout.exercises[0].id;
    store.updateSet(exerciseId, 0, 'weight', 100);
    store.updateSet(exerciseId, 0, 'reps', 8);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises[0].sets[0].weight).toBe(100);
    expect(state.currentWorkout.exercises[0].sets[0].reps).toBe(8);
  });

  it('should update energy level', () => {
    const store = useWorkoutStore.getState();
    store.updateEnergyLevel(8);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.energyLevel).toBe(8);
  });

  it('should update pump level', () => {
    const store = useWorkoutStore.getState();
    store.updatePumpLevel(9);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.pumpLevel).toBe(9);
  });

  it('should update notes', () => {
    const store = useWorkoutStore.getState();
    store.updateNotes('Great session!');
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.notes).toBe('Great session!');
  });

  it('should update duration', () => {
    const store = useWorkoutStore.getState();
    store.updateDuration(75);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.totalDuration).toBe(75);
  });

  it('should save a workout with exercises', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Bench Press');

    const exerciseId = useWorkoutStore.getState().currentWorkout.exercises[0].id;
    store.updateSet(exerciseId, 0, 'weight', 100);
    store.updateSet(exerciseId, 0, 'reps', 8);
    store.updateEnergyLevel(7);
    store.updatePumpLevel(8);
    store.updateDuration(60);
    store.saveWorkout();

    const state = useWorkoutStore.getState();
    expect(state.workouts).toHaveLength(1);
    expect(state.workouts[0].exercises[0].name).toBe('Bench Press');
    expect(state.workouts[0].exercises[0].sets[0].weight).toBe(100);
    expect(state.workouts[0].energyLevel).toBe(7);
    // Current workout should be reset
    expect(state.currentWorkout.exercises).toHaveLength(0);
  });

  it('should not save a workout without exercises', () => {
    const store = useWorkoutStore.getState();
    store.saveWorkout();
    const state = useWorkoutStore.getState();

    expect(state.workouts).toHaveLength(0);
  });

  it('should load template exercises', () => {
    const store = useWorkoutStore.getState();
    store.loadTemplateExercises([
      { name: 'Lat Pulldown', defaultSets: 3 },
      { name: 'Seated Row', defaultSets: 3 },
    ]);
    const state = useWorkoutStore.getState();

    expect(state.currentWorkout.exercises).toHaveLength(2);
    expect(state.currentWorkout.exercises[0].name).toBe('Lat Pulldown');
    expect(state.currentWorkout.exercises[0].sets).toHaveLength(3);
    expect(state.currentWorkout.exercises[1].name).toBe('Seated Row');
  });

  it('should persist and load from localStorage', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Squat');

    const exerciseId = useWorkoutStore.getState().currentWorkout.exercises[0].id;
    store.updateSet(exerciseId, 0, 'weight', 140);
    store.updateSet(exerciseId, 0, 'reps', 5);
    store.saveWorkout();

    // Reset store
    useWorkoutStore.setState({ workouts: [] });
    expect(useWorkoutStore.getState().workouts).toHaveLength(0);

    // Load from storage
    store.loadFromStorage();
    const state = useWorkoutStore.getState();
    expect(state.workouts).toHaveLength(1);
    expect(state.workouts[0].exercises[0].name).toBe('Squat');
  });

  it('should delete a workout', () => {
    const store = useWorkoutStore.getState();
    store.addExercise('Bench Press');
    store.saveWorkout();
    store.addExercise('Squat');
    store.saveWorkout();

    expect(useWorkoutStore.getState().workouts).toHaveLength(2);

    const workoutId = useWorkoutStore.getState().workouts[0].id;
    store.deleteWorkout(workoutId);

    expect(useWorkoutStore.getState().workouts).toHaveLength(1);
  });
});
