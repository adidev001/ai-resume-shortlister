import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search bar with debounce support.
 * @param {function} onSearch - Callback with debounced search term
 * @param {string} placeholder - Input placeholder
 * @param {number} debounceMs - Debounce delay in ms
 */
export default function SearchBar({
  onSearch,
  placeholder = 'Search candidates...',
  debounceMs = 400,
}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-11 pr-10"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
