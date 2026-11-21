// tracker.js — the saved checklist: which trophies are earned, kept in localStorage,
// plus export to a JSON file and import back. Nothing here touches the network.
export const STORAGE_KEY = 'leonida-legend-earned-v1';

// Load the earned trophy ids from localStorage. A corrupt value is ignored, never fatal.
export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  } catch {
    // Storage full or unavailable (private mode): the checklist still works in memory.
  }
}

// Count earned trophies overall and per grade, for the header progress display.
export function countProgress(trophies, earned) {
  const byGrade = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    if (!byGrade[t.grade]) byGrade[t.grade] = [0, 0];
    byGrade[t.grade][1] += 1;
    if (earned.has(t.id)) byGrade[t.grade][0] += 1;
  }
  return {
    earned: earned.size,
    total: trophies.length,
    percent: trophies.length ? Math.round((earned.size / trophies.length) * 100) : 0,
    byGrade,
  };
}

// Download the earned ids as a JSON file the user can keep or move to another browser.
export function exportProgress(earned) {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Read an exported progress file back into an earned set. Accepts both the export
// format ({earned: [...]}) and a bare array of ids. Unknown ids are dropped.
export async function importProgressFile(file, validIds) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('That file does not hold trophy progress.');
  return new Set(ids.filter((id) => validIds.has(id)));
}
