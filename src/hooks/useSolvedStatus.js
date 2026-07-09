import { useState, useCallback } from 'react';

/**
 * Custom hook to track solved LeetCode problems in LocalStorage using their IDs as keys.
 * Maintains a Set in state for quick, reactive UI updates.
 */
export default function useSolvedStatus() {
  const [solvedIds, setSolvedIds] = useState(new Set());

  // Initialize/sync solved IDs from localStorage based on the loaded problems list
  const syncSolvedStatus = useCallback((problems) => {
    if (!problems || !Array.isArray(problems)) return;
    
    const solved = new Set();
    problems.forEach((problem) => {
      if (problem.ID) {
        // Read directly from LocalStorage using the problem ID as key
        const status = localStorage.getItem(String(problem.ID));
        if (status === 'true') {
          solved.add(String(problem.ID));
        }
      }
    });
    setSolvedIds(solved);
  }, []);

  // Toggle solved status for a single problem
  const toggleSolved = useCallback((id) => {
    if (!id) return;
    const stringId = String(id);
    
    setSolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stringId)) {
        next.delete(stringId);
        localStorage.removeItem(stringId);
      } else {
        next.add(stringId);
        localStorage.setItem(stringId, 'true');
      }
      return next;
    });
  }, []);

  // Explicitly set solved status for a single problem (useful for detailed modal controls)
  const setSolvedState = useCallback((id, isSolved) => {
    if (!id) return;
    const stringId = String(id);
    
    setSolvedIds((prev) => {
      const next = new Set(prev);
      if (isSolved) {
        next.add(stringId);
        localStorage.setItem(stringId, 'true');
      } else {
        next.delete(stringId);
        localStorage.removeItem(stringId);
      }
      return next;
    });
  }, []);

  // Persist a solved or unsolved ID without touching the current in-memory set
  const persistSolvedState = useCallback((id, isSolved) => {
    if (!id) return;
    const stringId = String(id).trim();
    if (!stringId) return;

    if (isSolved) {
      localStorage.setItem(stringId, 'true');
    } else {
      localStorage.removeItem(stringId);
    }
  }, []);

  return {
    solvedIds,
    syncSolvedStatus,
    toggleSolved,
    setSolvedState,
    persistSolvedState,
  };
}
