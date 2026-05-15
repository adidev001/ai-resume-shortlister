import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, TrendingUp, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { candidateAPI } from '../services/api';

/**
 * Dashboard page showing summary metrics and quick actions.
 */
export default function Dashboard() {
  const [stats, setStats] = useState({ count: 0 });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [countRes, candidatesRes] = await Promise.all([
          candidateAPI.getCount(),
          candidateAPI.getAll({ limit: 5, page: 1 }),
        ]);
        setStats({ count: countRes.data.data.count });
        setRecentCandidates(candidatesRes.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-violet-600/10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-400">
              AI-Powered Recruiting
            </span>
          </div>
          <h1 className="text-3xl font-bold text-surface-100 mb-2">
            Welcome to <span className="gradient-text">HireAI</span>
          </h1>
          <p className="text-surface-400 max-w-xl">
            Intelligent candidate shortlisting with rule-based matching and AI-enhanced ranking.
            Find the best talent faster.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Candidates"
          value={stats.count}
          icon={Users}
          gradient="from-primary-500 to-primary-700"
          subtitle="In database"
        />
        <StatCard
          title="Quick Match"
          value="AI"
          icon={Target}
          gradient="from-violet-500 to-purple-700"
          subtitle="Ready to analyze"
        />
        <StatCard
          title="Matching Engine"
          value="Active"
          icon={TrendingUp}
          gradient="from-emerald-500 to-emerald-700"
          subtitle="Rule-based + AI"
        />
        <StatCard
          title="Add New"
          value="+"
          icon={UserPlus}
          gradient="from-amber-500 to-orange-600"
          subtitle="Expand your pool"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-surface-100">
              Recent Candidates
            </h3>
            <Link
              to="/candidates"
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentCandidates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-surface-600 mx-auto mb-3" />
              <p className="text-surface-500 text-sm">No candidates yet</p>
              <Link to="/candidates/new" className="btn-primary inline-flex mt-3 text-sm">
                Add First Candidate
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCandidates.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/30 to-primary-700/30 flex items-center justify-center text-primary-300 font-semibold text-sm">
                    {c.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-200 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {c.experience}y exp · {c.skills?.length} skills
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-primary-400 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-surface-100 mb-5">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/candidates/new"
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700/30 hover:border-primary-500/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-200">
                  Add Candidate
                </p>
                <p className="text-xs text-surface-500">
                  Add a new candidate profile
                </p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-surface-600 group-hover:text-primary-400 transition-colors" />
            </Link>

            <Link
              to="/match"
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700/30 hover:border-violet-500/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-200">
                  Start Matching
                </p>
                <p className="text-xs text-surface-500">
                  Find the best candidates for your role
                </p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-surface-600 group-hover:text-violet-400 transition-colors" />
            </Link>

            <Link
              to="/match"
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700/30 hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-200">
                  AI Shortlisting
                </p>
                <p className="text-xs text-surface-500">
                  Let AI rank and explain candidates
                </p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-surface-600 group-hover:text-emerald-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
