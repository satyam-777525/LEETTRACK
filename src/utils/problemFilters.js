export const parsePercentValue = (value) => {
  if (value === null || value === undefined || value === '') return 0;

  const cleaned = String(value).replace(/%/g, '').trim();
  const parsed = Number.parseFloat(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
};

const acceptanceThresholds = {
  all: 0,
  '20': 20,
  '30': 30,
  '40': 40,
  '50': 50,
  '60': 60,
  '70': 70,
  '80': 80,
  '90': 90,
};

export const getAcceptanceThreshold = (filterValue) => {
  return acceptanceThresholds[String(filterValue)] ?? 0;
};

export const filterProblems = ({
  problems,
  searchQuery,
  difficultyFilter,
  statusFilter,
  acceptanceRateFilter,
  solvedIds,
}) => {
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const acceptanceThreshold = getAcceptanceThreshold(acceptanceRateFilter);

  return problems.filter((problem) => {
    const title = String(problem.Title ?? '').toLowerCase();
    const id = String(problem.ID ?? '');
    const difficulty = String(problem.Difficulty ?? '').toLowerCase();
    const acceptance = parsePercentValue(problem.Acceptance);
    const isSolved = solvedIds.has(String(problem.ID));

    const matchesSearch =
      normalizedSearch === '' ||
      title.includes(normalizedSearch) ||
      id.includes(normalizedSearch);

    if (!matchesSearch) return false;
    if (difficultyFilter !== 'all' && difficulty !== difficultyFilter) return false;
    if (statusFilter === 'solved' && !isSolved) return false;
    if (statusFilter === 'unsolved' && isSolved) return false;
    if (acceptanceThreshold > 0 && acceptance < acceptanceThreshold) return false;

    return true;
  });
};