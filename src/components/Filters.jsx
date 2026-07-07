import React from 'react';
import { FaSearch, FaTimes, FaFilter, FaLayerGroup, FaCheckSquare } from 'react-icons/fa';

export default function Filters({
  searchQuery,
  setSearchQuery,
  difficultyFilter,
  setDifficultyFilter,
  statusFilter,
  setStatusFilter,
  counts = {
    all: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    solved: 0,
    unsolved: 0,
  },
}) {
  const difficultyOptions = [
    { id: 'all', label: 'All Difficulties', count: counts.all, activeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-2 ring-indigo-500/30' },
    { id: 'easy', label: 'Easy', count: counts.easy, activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/30' },
    { id: 'medium', label: 'Medium', count: counts.medium, activeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-2 ring-amber-500/30' },
    { id: 'hard', label: 'Hard', count: counts.hard, activeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-2 ring-rose-500/30' },
  ];

  const statusOptions = [
    { id: 'all', label: 'All Statuses', count: counts.all, activeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 ring-2 ring-indigo-500/30' },
    { id: 'solved', label: 'Solved', count: counts.solved, activeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40 ring-2 ring-teal-500/30' },
    { id: 'unsolved', label: 'Unsolved', count: counts.unsolved, activeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700 ring-2 ring-zinc-500/30' },
  ];

  return (
    <div className="w-full space-y-5 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Title/Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-550 uppercase tracking-wider">
          <FaFilter className="w-3 h-3 text-indigo-400" />
          <span>Advanced Filter Panel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-zinc-850/60">
        {/* Difficulty Selector Row */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <FaLayerGroup className="w-3.5 h-3.5" />
            <span>Difficulty Level</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {difficultyOptions.map((filter) => {
              const isSelected = difficultyFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setDifficultyFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? filter.activeClass
                      : 'border-zinc-850 bg-zinc-900/30 text-zinc-400 hover:text-zinc-250 hover:bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${
                      isSelected ? 'bg-black/25 text-current' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Selector Row */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <FaCheckSquare className="w-3.5 h-3.5" />
            <span>Solved Status</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((filter) => {
              const isSelected = statusFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? filter.activeClass
                      : 'border-zinc-850 bg-zinc-900/30 text-zinc-400 hover:text-zinc-250 hover:bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${
                      isSelected ? 'bg-black/25 text-current' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
