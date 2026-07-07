import React, { memo } from 'react';
import { FaSearch, FaTimes, FaFilter, FaLayerGroup, FaCheckSquare, FaPercentage } from 'react-icons/fa';

function Filters({
  searchQuery,
  setSearchQuery,
  difficultyFilter,
  setDifficultyFilter,
  statusFilter,
  setStatusFilter,
  acceptanceRateFilter,
  setAcceptanceRateFilter,
  onClearFilters,
  hasActiveFilters,
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

  const acceptanceOptions = [
    { id: 'all', label: 'All' },
    { id: '20', label: '>= 20%' },
    { id: '30', label: '>= 30%' },
    { id: '40', label: '>= 40%' },
    { id: '50', label: '>= 50%' },
    { id: '60', label: '>= 60%' },
    { id: '70', label: '>= 70%' },
    { id: '80', label: '>= 80%' },
    { id: '90', label: '>= 90%' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-zinc-950 p-5 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] animate-fade-in">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-[-3rem] h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-[-2rem] h-40 w-40 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:w-[28rem] xl:order-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title or ID..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-zinc-950/80 border border-white/8 text-zinc-100 placeholder-zinc-500 text-sm shadow-inner shadow-black/20 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/25 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="xl:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-300">
              <FaFilter className="h-3 w-3" />
              Advanced Filter Panel
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/6 bg-zinc-950/60 p-4 shadow-inner shadow-black/20">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              <FaLayerGroup className="h-3.5 w-3.5 text-indigo-400" />
              Difficulty Level
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {difficultyOptions.map((filter) => {
                const isSelected = difficultyFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setDifficultyFilter(filter.id)}
                    className={`px-4 py-2 rounded-2xl border text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? filter.activeClass
                        : 'border-white/10 bg-white/3 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 hover:border-white/15'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${isSelected ? 'bg-black/20 text-current' : 'bg-zinc-800 text-zinc-500'}`}>
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/6 bg-zinc-950/60 p-4 shadow-inner shadow-black/20">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              <FaCheckSquare className="h-3.5 w-3.5 text-teal-400" />
              Solved Status
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {statusOptions.map((filter) => {
                const isSelected = statusFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`px-4 py-2 rounded-2xl border text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? filter.activeClass
                        : 'border-white/10 bg-white/3 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 hover:border-white/15'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${isSelected ? 'bg-black/20 text-current' : 'bg-zinc-800 text-zinc-500'}`}>
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/6 bg-zinc-950/60 p-4 shadow-inner shadow-black/20">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              <FaPercentage className="h-3.5 w-3.5 text-fuchsia-400" />
              Acceptance Rate
            </div>
            <div className="relative">
              <select
                value={acceptanceRateFilter}
                onChange={(e) => setAcceptanceRateFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3.5 pr-11 text-sm font-semibold text-zinc-100 shadow-inner shadow-black/20 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/25 transition-all duration-300"
              >
                {acceptanceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.178l3.71-3.947a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-400">
            {hasActiveFilters ? 'Filters are active. Results update instantly.' : 'No filters applied.'}
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
              hasActiveFilters
                ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/15 hover:border-indigo-400/30'
                : 'border-white/5 bg-white/3 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <FaTimes className="w-3 h-3" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(Filters);
