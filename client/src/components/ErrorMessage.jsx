import { AlertCircle, X } from 'lucide-react';

/**
 * Reusable error message display.
 * @param {string} message - Error message
 * @param {function} onDismiss - Optional dismiss callback
 */
export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 animate-slide-up">
      <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-danger-400 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-danger-400 hover:text-danger-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
