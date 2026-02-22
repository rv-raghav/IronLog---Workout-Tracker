import type { WorkoutDayTemplate } from "../app/types";

/** Complete workout plan templates based on user's PPL split */
export const workoutTemplates: WorkoutDayTemplate[] = [
  {
    id: "pull",
    name: "Day 1 — Pull (Back, Rear Delts, Biceps)",
    exercises: [
      { name: "Lat Pulldown", defaultSets: 3, defaultReps: "8-10" },
      { name: "Seated Row", defaultSets: 3, defaultReps: "10-12" },
      { name: "One-Arm Dumbbell Row", defaultSets: 3, defaultReps: "8-10" },
      { name: "Dumbbell Shrugs", defaultSets: 3, defaultReps: "10-15" },
      { name: "Rear Delt Fly", defaultSets: 3, defaultReps: "12-15" },
      { name: "Dumbbell Curls", defaultSets: 3, defaultReps: "10-12" },
      { name: "Hammer Curls", defaultSets: 3, defaultReps: "10-12" },
    ],
  },
  {
    id: "push",
    name: "Day 2 — Push (Chest, Shoulders, Triceps)",
    exercises: [
      { name: "Incline Dumbbell Press", defaultSets: 3, defaultReps: "8-10" },
      { name: "Chest Press Machine", defaultSets: 3, defaultReps: "10-12" },
      { name: "Machine Shoulder Press", defaultSets: 3, defaultReps: "8-10" },
      { name: "Lateral Raises", defaultSets: 3, defaultReps: "12-15" },
      { name: "Cable Triceps Pushdown", defaultSets: 3, defaultReps: "12-15" },
      { name: "Overhead Rope Extension", defaultSets: 3, defaultReps: "12-15" },
    ],
  },
  {
    id: "legs",
    name: "Day 3 — Legs",
    exercises: [
      { name: "Back Squat / Hack Squat", defaultSets: 4, defaultReps: "6-8" },
      { name: "Leg Press", defaultSets: 3, defaultReps: "10-12" },
      { name: "Leg Extension", defaultSets: 3, defaultReps: "12-15" },
      { name: "Hamstring Curl", defaultSets: 3, defaultReps: "10-12" },
      { name: "Calf Raise", defaultSets: 4, defaultReps: "12-15" },
    ],
  },
  {
    id: "chest-back-arms",
    name: "Day 5 — Chest + Back + Arms",
    exercises: [
      { name: "Flat Dumbbell Press", defaultSets: 4, defaultReps: "6-8" },
      { name: "Cable Chest Fly", defaultSets: 3, defaultReps: "12-15" },
      {
        name: "Neutral Grip Lat Pulldown",
        defaultSets: 3,
        defaultReps: "10-12",
      },
      { name: "Seated Row", defaultSets: 3, defaultReps: "10-12" },
      { name: "Cable Bicep Curls", defaultSets: 3, defaultReps: "12-15" },
      {
        name: "Tricep Dips / Dip Machine",
        defaultSets: 3,
        defaultReps: "8-10",
      },
      { name: "Reverse Curl Machine", defaultSets: 3, defaultReps: "12-15" },
      { name: "Wrist Curl Machine", defaultSets: 3, defaultReps: "12-15" },
    ],
  },
  {
    id: "shoulders-legs",
    name: "Day 6 — Shoulders + Legs",
    exercises: [
      { name: "Dumbbell Shoulder Press", defaultSets: 4, defaultReps: "6-8" },
      { name: "Lateral Raises", defaultSets: 3, defaultReps: "12-15" },
      { name: "Front Squat / Hack Squat", defaultSets: 3, defaultReps: "6-8" },
      { name: "Hamstring Curl", defaultSets: 3, defaultReps: "10-12" },
      { name: "Leg Extension", defaultSets: 3, defaultReps: "12-15" },
    ],
  },
];
