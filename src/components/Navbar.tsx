import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/new', label: 'Workout', icon: '🏋️' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/history', label: 'History', icon: '📊' },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-iron-800/95 backdrop-blur-md border-t border-iron-600/50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-2xl mx-auto flex items-center justify-around py-2 px-4 md:py-3">
        {/* Logo — visible on desktop */}
        <NavLink
          to="/"
          className="hidden md:flex items-center gap-2 text-fire-500 font-display font-bold text-xl mr-auto"
        >
          🔥 IronLog
        </NavLink>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'text-fire-500 bg-fire-500/10'
                  : 'text-iron-400 hover:text-iron-200'
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span className="text-xs">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
