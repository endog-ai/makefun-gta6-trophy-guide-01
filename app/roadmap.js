// roadmap.js — the five-phase route to the platinum, built from the official
// descriptions: story chapters and missions first, then side strands, activities
// and collectibles, crime and cleanup, and the platinum itself. The missable
// warning lives here too, so a reader sees it before starting.
export const ROADMAP_PHASES = [
  {
    title: 'Phase 1 — Play the story first',
    count: '12 trophies',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    body: 'Finish the story at your own pace: Chapters 1–4, the final mission, and the six named story missions (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory). All 12 pop automatically — no gold medals, no mission replay. Free roam stays open after the finale, so nothing is lost by finishing first.',
    warning: 'Do the Chapter 1 balcony meditation (Positive Mental Attitude) before leaving Chapter 1 — the only possibly missable moment in the game.',
  },
  {
    title: 'Phase 2 — Side strands & strangers',
    count: '7 trophies',
    trophyIds: [22, 23, 24, 25, 26, 27, 29],
    body: 'Finish the mission strands for Andy, Kenton, Billy, Randy and Tyrone, hunt a unique animal for Bret, and complete 8 stranger strands in total for Strangers & Freaks. Start these as you find them during the story; finish them in free roam afterwards.',
    warning: '',
  },
  {
    title: 'Phase 3 — Activities & collectibles',
    count: '14 trophies',
    trophyIds: [15, 16, 17, 18, 19, 20, 21, 28, 30, 31, 35, 42, 46, 51],
    body: 'The long grind: 250 stunts, gold in all 42 shooting range challenges, drone races at all 14 Top Fun locations, 20 different race wins, fishing, arcade games, bowling, all 18 meditations, 3 card sets, 100 WAiNK scans, 100 vehicles discovered and all 52 areas of Leonida explored. Scan and collect as you travel — it saves hours of cleanup.',
    warning: '',
  },
  {
    title: 'Phase 4 — Crime & cleanup',
    count: '9 trophies',
    trophyIds: [33, 34, 36, 37, 38, 39, 40, 41, 43],
    body: 'Robberies and police escapes: 5 bank vaults (8 for 100%), an armored truck, a jewelry store without being detected, one illegal operation per gang, and the partner wanted-level trophies. Work these alongside Phase 3 — the money funds the garages and the $100,000 of shop spending.',
    warning: '',
  },
  {
    title: 'Phase 5 — The platinum',
    count: '13 trophies',
    trophyIds: [1, 14, 32, 44, 45, 47, 48, 49, 50, 52, 53, 54, 55],
    body: 'Finish the 100% Completion checklist (A Long Road — the hardest trophy), complete 50 of the 80 challenges, launder $250,000 in Marked Bills, spend $100,000 in shops, buy all 8 garages, register 10 vehicles with Scooter Bros, and mop up the five hidden trophies whose methods are still being confirmed. When the last one pops, Vice Got a Price! follows.',
    warning: '',
  },
];

// Render the phases into the page. In spoiler mode the Phase 1 trophy names are
// withheld (they give away chapter and mission titles); the other phases list names.
export function renderRoadmap(listElement, trophiesById, spoilersOn) {
  listElement.replaceChildren();
  for (const phase of ROADMAP_PHASES) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = phase.title;
    const count = document.createElement('span');
    count.className = 'phase-count';
    count.textContent = phase.count;
    heading.append(count);
    item.append(heading);
    const body = document.createElement('p');
    body.textContent = phase.body;
    item.append(body);
    if (phase.warning) {
      const warn = document.createElement('p');
      warn.innerHTML = '';
      const flag = document.createElement('span');
      flag.className = 'missable-flag';
      flag.textContent = '⚠ Possibly missable: ';
      warn.append(flag, document.createTextNode(phase.warning));
      item.append(warn);
    }
    const names = document.createElement('p');
    names.className = 'phase-trophies';
    const isStoryPhase = phase.trophyIds.every((id) => trophiesById.get(id)?.kind === 'story');
    if (spoilersOn && isStoryPhase) {
      names.textContent = 'Trophies: 12 story trophies — names hidden while spoiler mode is on.';
    } else {
      names.textContent = 'Trophies: ' + phase.trophyIds.map((id) => trophiesById.get(id)?.name ?? `#${id}`).join(' · ');
    }
    item.append(names);
    listElement.append(item);
  }
}
