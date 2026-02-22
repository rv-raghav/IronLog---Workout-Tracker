# 🔥 IronLog — Workout Tracker

A modern, mobile-first workout tracking app built with React. Log your exercises, sets, reps, and weight with ease. Track session metrics like energy, pump, and duration. View your workout history with weekly volume summaries.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Zustand | State management |
| React Router | Client-side routing |
| Tailwind CSS v4 | Styling |
| date-fns | Date formatting |
| Vitest | Unit testing |

## Project Structure

```
iron-log/
├── src/
│   ├── app/
│   │   ├── store.ts        # Zustand store — all workout state & actions
│   │   └── types.ts        # TypeScript types (SetEntry, Exercise, WorkoutSession)
│   ├── components/
│   │   ├── Navbar.tsx       # Bottom nav (mobile) / top nav (desktop)
│   │   ├── SetRow.tsx       # Single set row (weight + reps inputs)
│   │   ├── ExerciseCard.tsx # Exercise card with inline set management
│   │   ├── WorkoutForm.tsx  # Full workout form with template loader
│   │   └── WorkoutSummary.tsx # Expandable workout summary card
│   ├── pages/
│   │   ├── Home.tsx         # Dashboard — weekly stats, today's workout
│   │   ├── NewWorkout.tsx   # Create new workout page
│   │   └── History.tsx      # Workout history with monthly grouping
│   ├── utils/
│   │   ├── storage.ts       # localStorage read/write/export utilities
│   │   └── templates.ts     # PPL workout plan templates
│   ├── test/
│   │   ├── setup.ts         # Vitest setup (jest-dom matchers)
│   │   └── store.test.ts    # Unit tests for store logic
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind CSS + custom theme
├── docs/                    # Architecture & design documentation
├── index.html               # HTML entry with SEO + Google Fonts
├── vite.config.ts           # Vite + Tailwind + Vitest config
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone <repo-url>
cd iron-log
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## How It Works

### Data Persistence

All workout data is stored in the browser's `localStorage` under the key `iron-log-workouts`. Data persists across sessions and browser refreshes. No backend required.

- **Save**: When you tap "Save Workout", the entire workout session is serialized to JSON and stored
- **Load**: On app startup, saved workouts are loaded from localStorage
- **Export**: The History page has an "Export JSON" button that downloads all data as a `.json` file

### State Management

The app uses a single Zustand store (`src/app/store.ts`) that manages:

- `currentWorkout` — the workout being built right now
- `workouts` — array of all saved workout sessions
- Actions for adding/removing exercises, managing sets, updating metrics, and persistence

### Workout Templates

Pre-built workout templates based on a Push/Pull/Legs split are available on the New Workout page. Select a template to auto-populate exercises with the correct number of sets.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Tests cover all Zustand store actions including:
- Adding/removing exercises
- Set management (add, remove, update weight/reps)
- Session metrics (energy, pump, duration, notes)
- Save/load/delete from localStorage
- Template loading

## Documentation

See the `/docs` folder for detailed documentation:

- [Architecture](docs/architecture.md) — Component structure overview
- [Data Model](docs/data-model.md) — All TypeScript types explained
- [State Management](docs/state-management.md) — Why Zustand, store design
- [Setup Guide](docs/setup.md) — Installation & development guide
- [Future Improvements](docs/future-improvements.md) — Roadmap & ideas

## Future Roadmap

- 📈 Progress graphs & charts
- 🏆 Personal record (PR) tracking & highlighting
- 🌓 Light/dark theme toggle
- 📊 Weekly/monthly volume summaries
- ☁️ Backend sync & authentication
- 📱 PWA (installable on phone)
- 🔄 Import workouts from JSON

## License

MIT
