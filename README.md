# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/endog-ai/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/endog-ai/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The complete offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — built for the make.fun competition `gta6-trophy-guide-01`.

## What it is

- **Every trophy, officially**: all 55 names, descriptions and grades exactly as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden until earned), in `app/data/trophies.json`.
- **A real guide for each one**: written in our own words — what to do, where and how, and when it can be missed — with its sources cited beside it (Push Square, KeenGamer, GTAScoop, PlanetGTA6). Where no published guide has confirmed a detail yet (the game launched 19 November 2026), the guide says so plainly instead of inventing a method.
- **A roadmap to the platinum**: five phases in order — story first, side strands, activities & collectibles, crime & cleanup, then the platinum — with the one possibly missable trophy flagged up front.
- **A tracker**: tick trophies off; progress saves in `localStorage`, shows X/55 with a percentage bar and per-grade counts, and can be exported to a JSON file and imported back.
- **Filters**: by grade, by kind (story, side, activities, collectibles, crime, misc), by search text, missable-only, and hide-earned.
- **Spoiler mode**: hides story trophy names and descriptions until they are earned.
- **Offline**: static files under `app/` with no build step and no network requests at run time. Serve `app/` with any static server and open `index.html`.

## The one missable trophy

**Positive Mental Attitude** (meditate at all 18 spots) is the only trophy flagged as possibly missable: one meditation spot is at Jason's house in Chapter 1. After the mission *Down to Earth*, look for Lucia at Jason's house in the morning, follow her to the balcony and meditate before leaving Chapter 1. Everything else is unmissable in a single playthrough with free roam after the story. No online trophies, no mission gold medals, no mission replay. Platinum estimate: ~200–300 hours.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or serve `app/` with any static file server and open `index.html`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — the page: header with progress, missable warning, roadmap, filters, checklist, detail panel.
- `app/style.css` — the look: a dark Vice City neon style of our own (pink/cyan on deep violet). No images, no fetched fonts.
- `app/app.js` — boots the guide, renders the checklist, wires everything together.
- `app/tracker.js` — saved progress in `localStorage`, export/import.
- `app/filters.js` — grade/kind/search/missable/hide-earned filters and spoiler mode.
- `app/roadmap.js` — the five-phase route to the platinum.
- `app/detail.js` — the per-trophy guide panel with sources.
- `app/data/trophies.json` — the 55 official trophies with guides, counts, kinds, hidden/missable flags and sources.
- `screenshots/` — four renders of the app in a browser (see `shots.json` for the views).
- `main.ts`, `serve.ts`, `vendor/makefun-frontend.ts` — entry plumbing.

## Sources

- Push Square — GTA 6: Trophy Guide & Roadmap: https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap, All 55 Trophies: https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
- GTAScoop — GTA 6 Trophies & Achievements: Full List of 55 and Platinum: https://gtascoop.com/guides/gta-6-trophies-achievements/
- PlanetGTA6 — GTA 6 Trophies: All 55 trophies and Xbox achievements: https://www.planetgta6.com/en/gta-6-trophies/

## Note

An unofficial fan-made guide. Grand Theft Auto and GTA are trademarks of Rockstar Games. Not affiliated with Rockstar Games, Sony or PlayStation. No Rockstar logo or official artwork is used anywhere in this entry.

## License

MIT — see `LICENSE`.
