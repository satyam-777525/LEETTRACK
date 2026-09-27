import { useState, useCallback } from 'react';

/**
 * Custom hook to track premium/locked LeetCode problems in LocalStorage.
 * Maintains a Set in state for quick, reactive UI updates.
 */
export default function usePremiumStatus() {
  const [premiumIds, setPremiumIds] = useState(new Set());

  // Initialize/sync premium IDs from localStorage based on the loaded problems list
  const syncPremiumStatus = useCallback((problems) => {
    if (!problems || !Array.isArray(problems)) return;
    
    const premium = new Set();
    problems.forEach((problem) => {
      if (problem.ID) {
        const status = localStorage.getItem(`premium_${problem.ID}`);
        if (status === 'true') {
          premium.add(String(problem.ID));
        }
      }
    });
    setPremiumIds(premium);
  }, []);

  // Toggle premium status for a single problem
  const togglePremium = useCallback((id) => {
    if (!id) return;
    const stringId = String(id);
    const storageKey = `premium_${stringId}`;
    
    setPremiumIds((prev) => {
      const next = new Set(prev);
      if (next.has(stringId)) {
        next.delete(stringId);
        localStorage.removeItem(storageKey);
      } else {
        next.add(stringId);
        localStorage.setItem(storageKey, 'true');
      }
      return next;
    });
  }, []);

  return {
    premiumIds,
    syncPremiumStatus,
    togglePremium,
  };
}
