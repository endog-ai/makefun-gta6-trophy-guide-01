// app.js — boots the guide: loads the trophy data, renders the checklist and the
// roadmap, and wires the tracker, the filters and the guide panel together.
// The app fetches only its own data file; it makes no network request at run time.
import { loadEarned, saveEarned, countProgress, exportProgress, importProgressFile } from './tracker.js';
import { defaultFilters, filterTrophies, isSpoilerHidden, spoilerPlaceholder, KIND_LABELS } from './filters.js';
import { renderRoadmap } from './roadmap.js';
import { openTrophyDetail, closeTrophyDetail } from './detail.js';

const listElement = document.getElementById('trophy-list');
const progressText = document.getElementById('progress-text');
const progressPlatinum = document.getElementById('progress-platinum');
const progressFill = document.getElementById('progress-fill');
const gradeCounts = document.getElementById('grade-counts');
const filterStatus = document.getElementById('filter-status');
const shownCount = document.getElementById('shown-count');
const emptyNote = document.getElementById('empty-note');
const detailPanel = document.getElementById('detail-panel');
const detailBackdrop = document.getElementById('detail-backdrop');
const detailBody = document.getElementById('detail-body');

const response = await fetch('data/trophies.json');
const doc = await response.json();
const trophies = doc.trophies;
const trophiesById = new Map(trophies.map((t) => [t.id, t]));
const validIds = new Set(trophies.map((t) => t.id));

const filters = defaultFilters();
let earned = loadEarned();
let demoMode = false;

function gradePill(text, className) {
  const pill = document.createElement('span');
  pill.className = `pill ${className}`;
  pill.textContent = text;
  return pill;
}

function renderProgress() {
  const progress = countProgress(trophies, earned);
  progressText.textContent = `${progress.earned} of ${progress.total} earned · ${progress.percent}%`;
  progressFill.style.width = `${progress.percent}%`;
  progressPlatinum.textContent = earned.has(1) ? 'Platinum: earned!' : 'Platinum: locked';
  gradeCounts.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const [got, total] = progress.byGrade[grade];
    gradeCounts.append(gradePill(`${grade} ${got}/${total}`, grade));
  }
}

function toggleEarned(id, isEarned) {
  if (isEarned) earned.add(id);
  else earned.delete(id);
  if (!demoMode) saveEarned(earned);
  renderAll();
  refreshOpenDetail(id);
}

function refreshOpenDetail(id) {
  if (detailPanel.hidden) return;
  const current = detailBody.querySelector('h2')?.textContent;
  const trophy = trophiesById.get(id);
  if (trophy && current === trophy.name) {
    openTrophyDetail(detailPanel, detailBackdrop, detailBody, trophy, earned, toggleEarned);
  }
}

function sourceLine(trophy) {
  const line = document.createElement('p');
  line.className = 'sources-line';
  line.append(document.createTextNode('Sources: '));
  (trophy.sources ?? []).forEach((source, index) => {
    if (index > 0) line.append(document.createTextNode(' · '));
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = source.name.replace(/^([^-—]+)[—-].*$/, '$1').trim();
    line.append(link);
  });
  return line;
}

function trophyCard(trophy) {
  const card = document.createElement('article');
  card.className = 'card';
  card.id = `trophy-${trophy.id}`;
  if (earned.has(trophy.id)) card.classList.add('earned');

  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => toggleEarned(trophy.id, box.checked));
  head.append(box);

  const titleWrap = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'card-title';
  if (isSpoilerHidden(trophy, filters, earned)) {
    title.textContent = spoilerPlaceholder(trophy);
    title.classList.add('spoiler-name');
  } else {
    title.textContent = trophy.name;
  }
  titleWrap.append(title);
  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = isSpoilerHidden(trophy, filters, earned)
    ? 'Story trophy — its description is hidden until you earn it.'
    : trophy.description;
  titleWrap.append(desc);
  head.append(titleWrap);
  card.append(head);

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(gradePill(trophy.grade, trophy.grade));
  badges.append(gradePill(KIND_LABELS[trophy.kind] ?? trophy.kind, ''));
  if (trophy.hidden) badges.append(gradePill('Hidden', 'hidden'));
  if (trophy.missable) badges.append(gradePill('⚠ Possibly missable', 'missable'));
  if (earned.has(trophy.id)) badges.append(gradePill('✓ Earned', 'earned-pill'));
  card.append(badges);

  if (trophy.count !== null && trophy.count !== undefined) {
    const countLine = document.createElement('p');
    countLine.className = 'count-line';
    countLine.textContent = `Count: ${trophy.count.toLocaleString('en-US')}`;
    card.append(countLine);
  }

  const guide = document.createElement('p');
  guide.className = 'card-guide';
  guide.textContent = isSpoilerHidden(trophy, filters, earned)
    ? 'Guide hidden with the story trophy — earn it to reveal the guide.'
    : trophy.guide;
  card.append(guide);

  const links = document.createElement('div');
  links.className = 'card-links';
  const guideButton = document.createElement('button');
  guideButton.type = 'button';
  guideButton.className = 'guide-btn';
  guideButton.textContent = 'Read full guide & sources';
  guideButton.addEventListener('click', () => {
    openTrophyDetail(detailPanel, detailBackdrop, detailBody, trophy, earned, toggleEarned);
  });
  links.append(guideButton);
  card.append(links);
  card.append(sourceLine(trophy));
  return card;
}

function renderList() {
  const shown = filterTrophies(trophies, filters, earned);
  listElement.replaceChildren();
  for (const trophy of shown) listElement.append(trophyCard(trophy));
  shownCount.textContent = `(${shown.length} of ${trophies.length} shown)`;
  emptyNote.hidden = shown.length !== 0;
  const active = [];
  if (filters.grade !== 'all') active.push(`grade ${filters.grade}`);
  if (filters.kind !== 'all') active.push(`kind ${KIND_LABELS[filters.kind] ?? filters.kind}`);
  if (filters.missableOnly) active.push('missable only');
  if (filters.hideEarned) active.push('earned hidden');
  if (filters.search) active.push(`matching “${filters.search}”`);
  filterStatus.textContent = active.length ? `Showing ${shown.length} of ${trophies.length} — ${active.join(', ')}.` : '';
}

function renderAll() {
  renderProgress();
  renderList();
  renderRoadmap(document.getElementById('roadmap-list'), trophiesById, filters.spoilers);
}

// ---- Controls ----
document.getElementById('search').addEventListener('input', (event) => {
  filters.search = event.target.value.trim();
  renderList();
});
document.getElementById('grade-filter').addEventListener('change', (event) => {
  filters.grade = event.target.value;
  renderList();
});
document.getElementById('kind-filter').addEventListener('change', (event) => {
  filters.kind = event.target.value;
  renderList();
});
document.getElementById('missable-only').addEventListener('change', (event) => {
  filters.missableOnly = event.target.checked;
  renderList();
});
document.getElementById('hide-earned').addEventListener('change', (event) => {
  filters.hideEarned = event.target.checked;
  renderList();
});
document.getElementById('spoiler-toggle').addEventListener('change', (event) => {
  filters.spoilers = event.target.checked;
  renderAll();
});
document.getElementById('export-btn').addEventListener('click', () => exportProgress(earned));
document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    earned = await importProgressFile(file, validIds);
    if (!demoMode) saveEarned(earned);
    renderAll();
    filterStatus.textContent = `Imported progress: ${earned.size} of ${trophies.length} earned.`;
  } catch {
    filterStatus.textContent = 'That file could not be read as trophy progress.';
  }
  event.target.value = '';
});
document.getElementById('reset-btn').addEventListener('click', () => {
  earned = new Set();
  if (!demoMode) saveEarned(earned);
  renderAll();
});
document.getElementById('detail-close').addEventListener('click', () => closeTrophyDetail(detailPanel, detailBackdrop, detailBody));
detailBackdrop.addEventListener('click', () => closeTrophyDetail(detailPanel, detailBackdrop, detailBody));
document.querySelectorAll('[data-open-trophy]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const trophy = trophiesById.get(Number(link.dataset.openTrophy));
    if (trophy) openTrophyDetail(detailPanel, detailBackdrop, detailBody, trophy, earned, toggleEarned);
  });
});

// ---- Deep links, used by the screenshots and by readers sharing a trophy ----
// #demo ticks the 12 story trophies in memory only (labelled, never saved).
// #trophy=<id> opens that trophy's guide panel. #spoilers turns spoiler mode on.
// #roadmap is a plain anchor to the roadmap section.
const hash = new URLSearchParams(window.location.hash.slice(1));
if (hash.has('demo')) {
  demoMode = true;
  earned = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  document.getElementById('demo-note').hidden = false;
}
if (hash.has('spoilers')) {
  filters.spoilers = true;
  document.getElementById('spoiler-toggle').checked = true;
}
renderAll();
if (hash.has('trophy')) {
  const trophy = trophiesById.get(Number(hash.get('trophy')));
  if (trophy) openTrophyDetail(detailPanel, detailBackdrop, detailBody, trophy, earned, toggleEarned);
}
// The browser's own fragment jump can fire before the checklist renders (and
// can scroll back to the top when the fragment names no element), so re-apply
// the deep-link scroll once the page has loaded and painted.
function applyDeepLinkScroll() {
  if (hash.has('roadmap')) {
    document.getElementById('roadmap').scrollIntoView({ behavior: 'instant', block: 'start' });
  } else if (hash.has('spoilers')) {
    document.getElementById('trophy-2')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
}
applyDeepLinkScroll();
window.addEventListener('load', () => setTimeout(applyDeepLinkScroll, 150));
