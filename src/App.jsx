import React, { useState, useEffect, useMemo } from 'react';
import useSolvedStatus from './hooks/useSolvedStatus';
import CSVUploader from './components/CSVUploader';
import Dashboard from './components/Dashboard';
import Filters from './components/Filters';
import ProblemTable from './components/ProblemTable';
import ProblemModal from './components/ProblemModal';
import LeetCodeSync from './components/LeetCodeSync';
import { FaCode, FaUpload, FaSyncAlt } from 'react-icons/fa';

export default function App() {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProblem, setSelectedProblem] = useState(null);
  
  const { solvedIds, syncSolvedStatus, toggleSolved, setSolvedState } = useSolvedStatus();

  // Load problems from LocalStorage on mount
  useEffect(() => {
    const savedProblems = localStorage.getItem('leetrack-problems');
    if (savedProblems) {
      try {
        const parsed = JSON.parse(savedProblems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProblems(parsed);
        }
      } catch (err) {
        console.error('Failed to parse cached problems from localStorage:', err);
      }
    }
  }, []);

  // Sync solved status set whenever the problems list changes
  useEffect(() => {
    syncSolvedStatus(problems);
  }, [problems, syncSolvedStatus]);

  // Handle data load (either from CSV upload or demo load)
  const handleDataLoaded = (data) => {
    setProblems(data);
    localStorage.setItem('leetrack-problems', JSON.stringify(data));
  };

  // Reset or clear uploaded data to start fresh
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear the uploaded problems? Your solved progress for these problems will remain saved in LocalStorage.')) {
      setProblems([]);
      localStorage.removeItem('leetrack-problems');
      setSearchQuery('');
      setDifficultyFilter('all');
      setStatusFilter('all');
    }
  };

  // Cross-reference submissions from LeetCode with the loaded problem set
  const handleSyncSolved = (submissions) => {
    let matchedCount = 0;
    
    // Extract slugs and titles from submissions
    const solvedSlugs = new Set();
    const solvedTitles = new Set();
    
    submissions.forEach(sub => {
      if (sub.titleSlug) solvedSlugs.add(sub.titleSlug.toLowerCase().trim());
      if (sub.title) solvedTitles.add(sub.title.toLowerCase().trim());
    });

    // Check each loaded problem
    problems.forEach(problem => {
      // Extract slug from URL using robust regex (e.g., https://leetcode.com/problems/two-sum/description -> two-sum)
      let csvSlug = '';
      if (problem.URL) {
        const match = problem.URL.match(/\/problems\/([a-zA-Z0-9-]+)/);
        if (match) {
          csvSlug = match[1].toLowerCase().trim();
        }
      }

      const csvTitle = problem.Title.toLowerCase().trim();

      // Match by slug or title
      if ((csvSlug && solvedSlugs.has(csvSlug)) || solvedTitles.has(csvTitle)) {
        setSolvedState(problem.ID, true);
        matchedCount++;
      }
    });

    return { matchedCount, totalCount: submissions.length };
  };

  // Bulk check matching problems from the uploaded full solved list JSON
  const handleSyncAllSolved = (solvedIdsArray) => {
    let matchedCount = 0;
    
    // Map array elements to string IDs for matching
    const importedIds = new Set(solvedIdsArray.map(id => String(id).trim()));

    problems.forEach(problem => {
      if (importedIds.has(String(problem.ID))) {
        setSolvedState(problem.ID, true);
        matchedCount++;
      }
    });

    return matchedCount;
  };

  // Calculate live counts for filter buttons
  const counts = useMemo(() => {
    const all = problems.length;
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let solved = 0;
    let unsolved = 0;

    problems.forEach((p) => {
      const diff = String(p.Difficulty).toLowerCase();
      if (diff === 'easy') easy++;
      else if (diff === 'medium') medium++;
      else if (diff === 'hard') hard++;

      if (solvedIds.has(String(p.ID))) {
        solved++;
      } else {
        unsolved++;
      }
    });

    return { all, easy, medium, hard, solved, unsolved };
  }, [problems, solvedIds]);

  // Filter problems based on search query & selected category (Difficulty & Status)
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // 1. Filter by search query (title match)
      const matchesSearch = problem.Title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Filter by difficulty
      const diff = String(problem.Difficulty).toLowerCase();
      if (difficultyFilter !== 'all' && diff !== difficultyFilter) return false;

      // 3. Filter by solved status
      const isSolved = solvedIds.has(String(problem.ID));
      if (statusFilter === 'solved' && !isSolved) return false;
      if (statusFilter === 'unsolved' && isSolved) return false;

      return true;
    });
  }, [problems, searchQuery, difficultyFilter, statusFilter, solvedIds]);

  // Count solved problems overall
  const solvedCount = useMemo(() => {
    return problems.filter((p) => solvedIds.has(String(p.ID))).length;
  }, [problems, solvedIds]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-md shadow-indigo-500/10">
              <FaCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              LeetTrack
            </span>
          </div>

          {problems.length > 0 && (
            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all duration-300 text-xs font-semibold"
            >
              <FaUpload className="w-3 h-3 text-indigo-400" />
              Upload New CSV
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        {problems.length === 0 ? (
          <div className="flex-grow flex items-center justify-center py-12">
            <CSVUploader onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Stats */}
            <Dashboard total={problems.length} solved={solvedCount} />

            {/* Sync with LeetCode Profile widget */}
            <LeetCodeSync
              onSyncSolved={handleSyncSolved}
              onSyncAllSolved={handleSyncAllSolved}
            />

            {/* Filter controls & Search bar */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md space-y-6">
              <Filters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                difficultyFilter={difficultyFilter}
                setDifficultyFilter={setDifficultyFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                counts={counts}
              />

              {/* Problems list table */}
              <ProblemTable
                problems={filteredProblems}
                solvedIds={solvedIds}
                toggleSolved={toggleSolved}
                onRowClick={(p) => setSelectedProblem(p)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-zinc-600">
          LeetTrack Dashboard &bull; Local Storage Only &bull; Built with React + Vite + Tailwind CSS
        </div>
      </footer>

      {/* Problem Details Modal */}
      <ProblemModal
        problem={selectedProblem}
        isOpen={selectedProblem !== null}
        onClose={() => setSelectedProblem(null)}
        isSolved={selectedProblem ? solvedIds.has(String(selectedProblem.ID)) : false}
        toggleSolved={toggleSolved}
      />
    </div>
  );
}
