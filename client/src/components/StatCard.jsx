/**
 * Dashboard metric card with icon and optional trend indicator.
 * @param {string} title - Card title
 * @param {string|number} value - Main metric value
 * @param {ReactNode} icon - Lucide icon component
 * @param {string} gradient - Gradient CSS class for icon background
 * @param {string} subtitle - Optional subtitle
 */
export default function StatCard({ title, value, icon: Icon, gradient = 'from-primary-500 to-primary-700', subtitle }) {
  return (
    <div className="glass-card p-6 hover:border-primary-500/30 hover:shadow-glow transition-all duration-500 animate-slide-up group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-surface-100 group-hover:gradient-text transition-all duration-300">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-surface-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
      </div>
    </div>
  );
}
