import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Target,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/candidates', label: 'Candidates', icon: Users },
  { path: '/candidates/new', label: 'Add Candidate', icon: UserPlus },
  { path: '/match', label: 'Job Matching', icon: Target },
];

/**
 * Sidebar navigation with animated active state indicators.
 */
export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-900/80 backdrop-blur-xl border-r border-surface-700/50 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-surface-700/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">HireAI</h1>
            <p className="text-[10px] text-surface-500 uppercase tracking-widest">
              Smart Recruiting
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-300 shadow-glow'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive
                    ? 'text-primary-400'
                    : 'text-surface-500 group-hover:text-surface-300'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-700/50">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-surface-500">Powered by</p>
          <p className="text-sm font-semibold gradient-text">OpenRouter AI</p>
        </div>
      </div>
    </aside>
  );
}
