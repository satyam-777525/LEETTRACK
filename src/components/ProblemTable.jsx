import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaExternalLinkAlt, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const PAGE_SIZE = 100;

const difficultyWeight = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const parsePercent = (val) => {
  if (!val) return 0;
  const clean = String(val).replace(/%/g, '').trim();
  return parseFloat(clean) || 0;
};

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

const ProblemRow = memo(function ProblemRow({ problem, isSolved, onRowClick, toggleSolved }) {
  const frequencyValue = parsePercent(problem.Frequency);

  return (
    <tr
      onClick={() => onRowClick(problem)}
      className={`hover:bg-zinc-800/30 transition-colors group cursor-pointer ${
        isSolved ? 'bg-emerald-500/1' : ''
      }`}
    >
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

      <td className="px-4 py-4 text-zinc-500 font-mono text-xs">#{problem.ID}</td>

      <td className="px-6 py-4 font-semibold text-zinc-200 group-hover:text-white transition-colors">
        {problem.Title}
      </td>

      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyBadge(problem.Difficulty)}`}>
          {problem.Difficulty}
        </span>
      </td>

      <td className="px-6 py-4 text-zinc-300 font-mono text-xs">{problem.Acceptance}</td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-zinc-300 font-mono text-xs shrink-0 w-10">{problem.Frequency}</span>
          <div className="hidden sm:block w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${frequencyValue}%` }}
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </td>

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
});

function ProblemTable({ problems, solvedIds, toggleSolved, onRowClick }) {
  const [sortConfig, setSortConfig] = useState({ key: 'ID', direction: 'ascending' });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);
  const sortUsesSolved = sortConfig.key === 'solved';

  const requestSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig.direction, sortConfig.key]);

  const sortedProblems = useMemo(() => {
    if (!sortConfig.key) return problems;

    return [...problems].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'solved') {
        aVal = solvedIds.has(String(a.ID)) ? 1 : 0;
        bVal = solvedIds.has(String(b.ID)) ? 1 : 0;
      } else if (sortConfig.key === 'ID') {
        aVal = parseInt(a.ID, 10) || 0;
        bVal = parseInt(b.ID, 10) || 0;
      } else if (sortConfig.key === 'Difficulty') {
        aVal = difficultyWeight[String(a.Difficulty).toLowerCase()] || 0;
        bVal = difficultyWeight[String(b.Difficulty).toLowerCase()] || 0;
      } else if (sortConfig.key === 'Acceptance' || sortConfig.key === 'Frequency') {
        aVal = parsePercent(aVal);
        bVal = parsePercent(bVal);
      } else {
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
  }, [problems, sortConfig, sortUsesSolved ? solvedIds : null]);

  const visibleProblems = useMemo(() => {
    return sortedProblems.slice(0, visibleCount);
  }, [sortedProblems, visibleCount]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sortedProblems]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setVisibleCount((current) => {
          if (current >= sortedProblems.length) return current;
          return Math.min(current + PAGE_SIZE, sortedProblems.length);
        });
      },
      {
        root: null,
        rootMargin: '240px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [sortedProblems.length]);

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
                <th
                  onClick={() => requestSort('solved')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-16 text-center select-none"
                >
                  <div className="flex items-center justify-center gap-1 group">
                    <span>Solved</span>
                    {getSortIcon('solved')}
                  </div>
                </th>

                <th
                  onClick={() => requestSort('ID')}
                  className="px-4 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-24 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>ID</span>
                    {getSortIcon('ID')}
                  </div>
                </th>

                <th
                  onClick={() => requestSort('Title')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Title</span>
                    {getSortIcon('Title')}
                  </div>
                </th>

                <th
                  onClick={() => requestSort('Difficulty')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-32 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Difficulty</span>
                    {getSortIcon('Difficulty')}
                  </div>
                </th>

                <th
                  onClick={() => requestSort('Acceptance')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-32 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Acceptance</span>
                    {getSortIcon('Acceptance')}
                  </div>
                </th>

                <th
                  onClick={() => requestSort('Frequency')}
                  className="px-6 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors w-40 select-none"
                >
                  <div className="flex items-center gap-1 group">
                    <span>Frequency</span>
                    {getSortIcon('Frequency')}
                  </div>
                </th>

                <th className="px-6 py-4 text-right w-24 select-none">Link</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-850/60 text-sm">
              {sortedProblems.length > 0 ? (
                <>
                  {visibleProblems.map((problem) => {
                    const isSolved = solvedIds.has(String(problem.ID));

                    return (
                      <ProblemRow
                        key={problem.ID}
                        problem={problem}
                        isSolved={isSolved}
                        onRowClick={onRowClick}
                        toggleSolved={toggleSolved}
                      />
                    );
                  })}

                  {visibleCount < sortedProblems.length && (
                    <tr ref={sentinelRef} aria-hidden="true">
                      <td colSpan="7" className="py-5 text-center text-xs text-zinc-500">
                        Loading more questions...
                      </td>
                    </tr>
                  )}
                </>
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
    </div>
  );
}

export default memo(ProblemTable);
