import React, { useState, useMemo } from 'react';
import { FaExternalLinkAlt, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ProblemTable({
  problems,
  solvedIds,
  toggleSolved,
  onRowClick,
}) {
  const [sortConfig, setSortConfig] = useState({ key: 'ID', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Difficulty ordering map for sorting
  const difficultyWeight = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
  };

  // Helper to parse percentages (e.g., "52.3%" -> 52.3)
  const parsePercent = (val) => {
    if (!val) return 0;
    const clean = String(val).replace(/%/g, '').trim();
    return parseFloat(clean) || 0;
  };

  // Handle Sort Request
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Process Sorting
  const sortedProblems = useMemo(() => {
    if (!sortConfig.key) return problems;

    return [...problems].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle custom sorting cases
      if (sortConfig.key === 'solved') {
        aVal = solvedIds.has(String(a.ID)) ? 1 : 0;
        bVal = solvedIds.has(String(b.ID)) ? 1 : 0;
      } else if (sortConfig.key === 'ID') {
        aVal = parseInt(a.ID) || 0;
        bVal = parseInt(b.ID) || 0;
      } else if (sortConfig.key === 'Difficulty') {
        aVal = difficultyWeight[String(a.Difficulty).toLowerCase()] || 0;
        bVal = difficultyWeight[String(b.Difficulty).toLowerCase()] || 0;
      } else if (sortConfig.key === 'Acceptance' || sortConfig.key === 'Frequency') {
        aVal = parsePercent(aVal);
        bVal = parsePercent(bVal);
      } else {
        // String sorting (Title, URL, etc.)
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [problems, sortConfig, solvedIds]);

  // Process Pagination
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProblems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProblems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProblems.length / itemsPerPage) || 1;

  // Reset page if filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [problems.length, itemsPerPage]);

  // Get difficulty badge class
  const getDifficultyBadge = (difficulty) => {
    const diff = String(difficulty).toLowerCase();
    switch (diff) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  // Render sort icon helper
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />;
    }
    return sortConfig.direction === 'ascending'
      ? <FaSortUp className="w-3 h-3 text-indigo-400" />
      : <FaSortDown className="w-3 h-3 text-indigo-400" />;
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold text-zinc-400 tracking-wider">
                {/* Checkbox Col */}
                <th
                  onClick={() => requestSort('solved')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-16 text-center select-none"
                >
                  <div className="flex items-center justify-center gap-1 group">
                    <span>Solved</span>
                    {getSortIcon('solved')}
                  </div>
                </th>
                
                {/* ID Col */}
                <th
                  onClick={() => requestSort('ID')}
                  className="px-4 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-24 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>ID</span>
                    {getSortIcon('ID')}
                  </div>
                </th>

                {/* Title Col */}
                <th
                  onClick={() => requestSort('Title')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Title</span>
                    {getSortIcon('Title')}
                  </div>
                </th>

                {/* Difficulty Col */}
                <th
                  onClick={() => requestSort('Difficulty')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-32 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Difficulty</span>
                    {getSortIcon('Difficulty')}
                  </div>
                </th>

                {/* Acceptance Col */}
                <th
                  onClick={() => requestSort('Acceptance')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-32 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Acceptance</span>
                    {getSortIcon('Acceptance')}
                  </div>
                </th>

                {/* Frequency Col */}
                <th
                  onClick={() => requestSort('Frequency')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-40 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Frequency</span>
                    {getSortIcon('Frequency')}
                  </div>
                </th>

                {/* Open Action Col */}
                <th className="px-6 py-4 text-right w-24 select-none">Link</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-zinc-850/60 text-sm">
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => {
                  const isSolved = solvedIds.has(String(problem.ID));
                  const frequencyValue = parsePercent(problem.Frequency);
                  
                  return (
                    <tr
                      key={problem.ID}
                      onClick={() => onRowClick(problem)}
                      className={`hover:bg-zinc-800/30 transition-colors group cursor-pointer ${
                        isSolved ? 'bg-emerald-500/[0.01]' : ''
                      }`}
                    >
                      {/* Checkbox Cell */}
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-4 text-center"
                      >
                        <div className="flex items-center justify-center">
                          <label className="relative flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSolved}
                              onChange={() => toggleSolved(problem.ID)}
                              className="sr-only peer"
                            />
                            <div className="w-5 h-5 bg-zinc-900 border border-zinc-700 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-all duration-300 peer-focus:ring-2 peer-focus:ring-indigo-500/40">
                              <svg
                                className={`w-3.5 h-3.5 text-black font-bold transition-transform duration-300 ${
                                  isSolved ? 'scale-100' : 'scale-0'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3.5"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </label>
                        </div>
                      </td>

                      {/* ID Cell */}
                      <td className="px-4 py-4 text-zinc-500 font-mono text-xs">
                        #{problem.ID}
                      </td>

                      {/* Title Cell */}
                      <td className="px-6 py-4 font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {problem.Title}
                      </td>

                      {/* Difficulty Cell */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyBadge(problem.Difficulty)}`}>
                          {problem.Difficulty}
                        </span>
                      </td>

                      {/* Acceptance Cell */}
                      <td className="px-6 py-4 text-zinc-300 font-mono text-xs">
                        {problem.Acceptance}
                      </td>

                      {/* Frequency Cell */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-300 font-mono text-xs shrink-0 w-10">
                            {problem.Frequency}
                          </span>
                          <div className="hidden sm:block w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${frequencyValue}%` }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Open Action Cell */}
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-4 text-right"
                      >
                        <a
                          href={problem.URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300 text-xs font-medium"
                        >
                          <span>Open</span>
                          <FaExternalLinkAlt className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-zinc-500">
                    No problems found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 font-mono text-xs cursor-pointer"
          >
            {[10, 25, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>problems per page</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs">
            Showing <strong className="text-zinc-200">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-zinc-200">
              {Math.min(currentPage * itemsPerPage, sortedProblems.length)}
            </strong>{' '}
            of <strong className="text-zinc-200">{sortedProblems.length}</strong> problems
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-zinc-850 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-900/50 text-zinc-300 transition-colors cursor-pointer"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <span className="font-mono text-xs px-2 select-none">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-zinc-850 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-900/50 text-zinc-300 transition-colors cursor-pointer"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
