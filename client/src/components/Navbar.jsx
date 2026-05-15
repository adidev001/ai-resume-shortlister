import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/candidates': 'Candidates',
  '/candidates/new': 'Add Candidate',
  '/match': 'Job Matching',
};

/**
 * Top navigation bar with page title and search icon.
 */
export default function Navbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'HireAI';

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-950/80 backdrop-blur-xl border-b border-surface-700/50 flex items-center justify-between px-8">
      <div>
        <h2 className="text-lg font-semibold text-surface-100">{title}</h2>
        <p className="text-xs text-surface-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-all duration-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
          R
        </div>
      </div>
    </header>
  );
}
