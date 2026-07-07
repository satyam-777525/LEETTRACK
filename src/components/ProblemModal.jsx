import React, { useState, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt, FaCopy, FaCheckCircle, FaPercentage, FaFire } from 'react-icons/fa';

export default function ProblemModal({
  problem,
  isOpen,
  onClose,
  isSolved,
  toggleSolved,
}) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !problem) return null;

  const handleCopyLink = async () => {
    if (!problem.URL) return;
    try {
      await navigator.clipboard.writeText(problem.URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-fade-in z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <span className="text-zinc-500 font-mono text-xs block mb-1">
            Problem #{problem.ID}
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            {problem.Title}
          </h3>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Difficulty</span>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold border w-fit ${getDifficultyBadge(problem.Difficulty)}`}>
              {problem.Difficulty}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <FaPercentage className="w-2.5 h-2.5 text-indigo-400" />
              Acceptance
            </span>
            <span className="text-sm font-bold font-mono text-zinc-200 mt-2">
              {problem.Acceptance}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <FaFire className="w-2.5 h-2.5 text-amber-400" />
              Frequency
            </span>
            <span className="text-sm font-bold font-mono text-zinc-200 mt-2">
              {problem.Frequency}
            </span>
          </div>
        </div>

        {/* URL / Resource Section */}
        <div className="mb-6 p-4 rounded-xl bg-zinc-900/20 border border-zinc-900">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">LeetCode Link</span>
          <a
            href={problem.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 break-all select-all flex items-center gap-1.5 hover:underline"
          >
            {problem.URL}
            <FaExternalLinkAlt className="w-2.5 h-2.5 shrink-0" />
          </a>
        </div>

        {/* Checkbox State Synchronizer */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-850 bg-zinc-900/40 mb-6">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-200">Solved Status</span>
            <span className="text-xs text-zinc-500">Toggle whether this challenge is solved.</span>
          </div>
          
          <label className="relative flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSolved}
              onChange={() => toggleSolved(problem.ID)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-zinc-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500/40 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-zinc-100 peer-checked:bg-emerald-500" />
          </label>
        </div>

        {/* Action Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyLink}
            className={`w-full sm:w-1/2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300'
            }`}
          >
            {copied ? (
              <>
                <FaCheckCircle className="w-4 h-4" />
                Copied Link!
              </>
            ) : (
              <>
                <FaCopy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>

          <a
            href={problem.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/30 text-center"
          >
            Open Problem
            <FaExternalLinkAlt className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
