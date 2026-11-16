# Bunker Tycoon
Independent underground colony management prototype, built from scratch. No code or assets from Glazed & Confused or any other game are used.

## Play locally
Download this repository (Code → Download ZIP), extract it and open `index.html` in a modern browser. No build or dependencies are required. A static HTTP server is recommended for consistent browser save behaviour. For example, if Python is installed, run `python3 -m http.server 8000` here and visit http://localhost:8000.

This is a mobile-friendly browser foundation, not yet a packaged Android/iOS application or a deployed website.

## Controls
- Tap reachable rock, then **Excavate**. Rooms expand sideways.
- Excavate below the central access shaft to unlock deeper floors.
- Tap an empty excavated chamber and select a facility.
- Swipe the bunker horizontally on narrow screens and vertically to explore floors.
- Use **Recover entrance supplies** for repeatable materials while prototyping.
- Build living quarters before welcoming residents.
- Pause at any time; construction remains available.
- Saves are local to this browser. Export JSON for backup or moving devices. Import validates the save and asks before replacing the current bunker.

## Implemented
- Seven columns and eight floors with connected excavation rules.
- Generators, water treatment, hydroponics, food stores, water tanks, batteries, living quarters and workshops.
- Deterministic one-second production, consumption, capacities and per-room operating status.
- Resident housing and food/water consumption.
- Automatic saving after actions and every five active simulation seconds.
- Simulation pauses in hidden tabs. No offline catch-up, absence penalties or resident deaths.
- Accessible named buttons, keyboard focus indicators and touch-sized controls.

## Architecture
- `engine.js`: DOM-independent simulation, commands and save validation; reusable in a future client.
- `app.js`: browser rendering, interactions and persistence.
- `style.css`: responsive underground cutaway interface.
- `engine.test.js`: dependency-free simulation regression tests.

Run tests with `node engine.test.js`.

## Validation
Eight simulation tests passed in a JavaScript runtime during implementation. Application JavaScript syntax was checked. Browser/device rendering and interaction testing has not yet been performed because no browser execution environment was available.

## Intentional prototype limits
Placeholder visuals; no animated residents, staffing assignments, fuel, maintenance, expeditions, research, cloud saves, monetisation or native packaging yet. Buildings currently operate automatically. Production priority is water, then farming, then workshops, using insertion order within each type. Supply recovery is unlimited to prevent prototype dead ends. Balance is provisional.

## Next milestones
1. Browser and physical-phone QA.
2. Resident movement and staffing; room upgrades and maintenance.
3. Progression, research, expeditions and a first-session tutorial.
4. Original visual identity, audio and performance profiling.
5. Select native packaging after the core loop is validated.
