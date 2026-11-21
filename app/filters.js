// filters.js — which trophies the checklist shows: grade, kind, search text,
// missable-only and hide-earned, plus the spoiler setting that hides story
// trophy names and descriptions until they are earned.
export const KIND_LABELS = {
  story: 'Story',
  side: 'Side & strangers',
  activity: 'Activities',
  collectible: 'Collectibles',
  crime: 'Crime & robberies',
  misc: 'Misc',
};

export function defaultFilters() {
  return { grade: 'all', kind: 'all', search: '', missableOnly: false, hideEarned: false, spoilers: false };
}

// A trophy passes when it matches every active filter at once.
export function trophyMatches(trophy, filters, earned) {
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.hideEarned && earned.has(trophy.id)) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${KIND_LABELS[trophy.kind] ?? trophy.kind}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function filterTrophies(trophies, filters, earned) {
  return trophies.filter((t) => trophyMatches(t, filters, earned));
}

// Spoiler mode hides a story trophy's name and description until it is earned.
// The platinum and non-story trophies are never hidden by it.
export function isSpoilerHidden(trophy, filters, earned) {
  return filters.spoilers && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function spoilerPlaceholder(trophy) {
  return `Hidden story trophy #${trophy.id} — earn it to reveal its name.`;
}
