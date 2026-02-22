import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/new', label: 'Workout', icon: '🏋️' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/history', label: 'History', icon: '📊' },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-white/[0.06] md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-2xl mx-auto flex items-center justify-around py-1.5 px-4 md:py-2.5">
        {/* Logo — visible on desktop */}
        <NavLink
          to="/"
          className="hidden md:flex items-center gap-2 mr-auto group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform duration-200">🔥</span>
          <span className="font-display font-bold text-lg text-gradient-fire">IronLog</span>
        </NavLink>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-300 text-sm font-medium press ${
                isActive
                  ? 'text-fire-400 bg-fire-500/10 glow-fire'
                  : 'text-iron-400 hover:text-iron-200 hover:bg-white/[0.03]'
              }`
            }
          >
            <span className="text-lg transition-transform duration-200">{link.icon}</span>
            <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
