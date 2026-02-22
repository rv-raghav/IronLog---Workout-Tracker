import type { WorkoutSession } from '../app/types';

const STORAGE_KEY = 'iron-log-workouts';

/** Load all saved workouts from localStorage */
export function loadWorkouts(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WorkoutSession[];
  } catch {
    console.error('Failed to load workouts from localStorage');
    return [];
  }
}

/** Save workouts array to localStorage */
export function saveWorkouts(workouts: WorkoutSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch {
    console.error('Failed to save workouts to localStorage');
  }
}

/** Export all workouts as a JSON file download */
export function exportWorkoutsToJSON(workouts: WorkoutSession[]): void {
  const blob = new Blob([JSON.stringify(workouts, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `iron-log-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
