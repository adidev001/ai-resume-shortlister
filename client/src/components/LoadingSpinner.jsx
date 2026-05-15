import { Loader2 } from 'lucide-react';

/**
 * Reusable loading spinner with optional message.
 * @param {string} message - Loading message to display
 * @param {string} size - Spinner size: 'sm', 'md', 'lg'
 */
export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <Loader2
        className={`${sizes[size]} text-primary-400 animate-spin mb-3`}
      />
      {message && (
        <p className="text-sm text-surface-400 animate-pulse-soft">{message}</p>
      )}
    </div>
  );
}
