// detail.js — the per-trophy guide panel: official description, grade, kind,
// the guide in our own words, its sources with links, and the missable badge.
import { KIND_LABELS } from './filters.js';

function sourceLink(source) {
  const link = document.createElement('a');
  link.href = source.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = source.name;
  return link;
}

function badge(text, className) {
  const pill = document.createElement('span');
  pill.className = `pill ${className}`;
  pill.textContent = text;
  return pill;
}

// Fill the panel with one trophy's full guide and show it. `onToggleEarned`
// runs when the reader ticks the trophy off from inside the panel.
export function openTrophyDetail(panel, backdrop, body, trophy, earned, onToggleEarned) {
  body.replaceChildren();

  const title = document.createElement('h2');
  title.textContent = trophy.name;
  body.append(title);

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(badge(trophy.grade, trophy.grade));
  badges.append(badge(KIND_LABELS[trophy.kind] ?? trophy.kind, ''));
  if (trophy.hidden) badges.append(badge('Hidden on PSN', 'hidden'));
  if (trophy.missable) badges.append(badge('⚠ Possibly missable', 'missable'));
  if (earned.has(trophy.id)) badges.append(badge('✓ Earned', 'earned-pill'));
  body.append(badges);

  const officialHeading = document.createElement('h3');
  officialHeading.textContent = 'Official description';
  body.append(officialHeading);
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = `\u201c${trophy.description}\u201d`;
  body.append(official);

  if (trophy.count !== null && trophy.count !== undefined) {
    const countLine = document.createElement('p');
    countLine.className = 'count-line';
    countLine.textContent = `PlayStation tracks a count for this one: ${trophy.count.toLocaleString('en-US')}.`;
    body.append(countLine);
  }

  const guideHeading = document.createElement('h3');
  guideHeading.textContent = 'Guide';
  body.append(guideHeading);
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  body.append(guide);

  const sourcesHeading = document.createElement('h3');
  sourcesHeading.textContent = 'Sources';
  body.append(sourcesHeading);
  const list = document.createElement('ul');
  for (const source of trophy.sources ?? []) {
    const item = document.createElement('li');
    item.append(sourceLink(source));
    list.append(item);
  }
  if (!list.children.length) {
    const item = document.createElement('li');
    item.textContent = 'Official trophy list (PlayStation).';
    list.append(item);
  }
  body.append(list);

  const earnRow = document.createElement('label');
  earnRow.className = 'earn-row';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.addEventListener('change', () => onToggleEarned(trophy.id, box.checked));
  earnRow.append(box, document.createTextNode(box.checked ? 'Earned — ticked off in your checklist.' : 'Mark this trophy as earned.'));
  body.append(earnRow);

  panel.hidden = false;
  backdrop.hidden = false;
}

export function closeTrophyDetail(panel, backdrop, body) {
  panel.hidden = true;
  backdrop.hidden = true;
  body.replaceChildren();
}
