import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NewWorkout from './pages/NewWorkout';
import ExerciseProgress from './pages/ExerciseProgress';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-iron-900 flex flex-col">
        {/* Page content */}
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-24 md:pt-20 md:pb-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewWorkout />} />
            <Route path="/history" element={<History />} />
            <Route path="/progress" element={<ExerciseProgress />} />
          </Routes>
        </main>

        {/* Navigation */}
        <Navbar />
      </div>
    </BrowserRouter>
  );
}
