import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddCandidate from './pages/AddCandidate';
import CandidateList from './pages/CandidateList';
import JobMatch from './pages/JobMatch';

/**
 * Main application component with layout and routing.
 */
export default function App() {
  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="/candidates/new" element={<AddCandidate />} />
            <Route path="/match" element={<JobMatch />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
