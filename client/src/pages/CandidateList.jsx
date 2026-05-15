import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';
import CandidateCard from '../components/CandidateCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useCandidates } from '../hooks/useCandidates';

/**
 * Candidate list page with search, filtering, and pagination.
 */
export default function CandidateList() {
  const { candidates, pagination, loading, error, fetchCandidates, deleteCandidate, setError } =
    useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ minExp: '', maxExp: '', skills: '' });

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      fetchCandidates({
        search: term,
        page: 1,
        ...filters,
      });
    },
    [fetchCandidates, filters]
  );

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    fetchCandidates({ search: searchTerm, page: 1, ...newFilters });
  };

  const handlePageChange = (page) => {
    fetchCandidates({ search: searchTerm, page, ...filters });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteCandidate(id);
      } catch (err) {
        // Error handled by hook
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-100">Candidates</h2>
          <p className="text-sm text-surface-400">
            {pagination.total} candidate{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link to="/candidates/new" className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Candidate
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar onSearch={handleSearch} placeholder="Search by name or bio..." />
          </div>
          <div>
            <input
              type="number"
              placeholder="Min experience"
              value={filters.minExp}
              onChange={(e) => handleFilterChange('minExp', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max experience"
              value={filters.maxExp}
              onChange={(e) => handleFilterChange('maxExp', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Loading */}
      {loading ? (
        <LoadingSpinner message="Loading candidates..." />
      ) : candidates.length === 0 ? (
        /* Empty State */
        <div className="glass-card p-12 text-center">
          <Users className="w-16 h-16 text-surface-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-surface-300 mb-2">
            No candidates found
          </h3>
          <p className="text-surface-500 mb-6">
            {searchTerm || filters.minExp || filters.maxExp
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first candidate'}
          </p>
          {!searchTerm && !filters.minExp && !filters.maxExp && (
            <Link to="/candidates/new" className="btn-primary inline-flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add First Candidate
            </Link>
          )}
        </div>
      ) : (
        /* Candidate Grid */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
