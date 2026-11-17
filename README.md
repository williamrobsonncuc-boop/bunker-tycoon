# Bunker Tycoon
Independent underground civilian colony management prototype, set during a fictional ongoing World War 3. No code or assets from Glazed & Confused or any other game are used.

## Play locally
Download this repository (Code → Download ZIP), extract it and open `index.html` in a modern browser. No build or dependencies are required. A static HTTP server is recommended for consistent browser save behaviour. For example, if Python is installed, run `python3 -m http.server 8000` here and visit http://localhost:8000.

This is a mobile-friendly browser foundation, not yet a packaged Android/iOS application or a deployed website.

## Controls
- Tap reachable rock, then **Excavate**. Rooms expand sideways.
- Excavate below the central access shaft to unlock deeper floors.
- Tap an empty excavated chamber and select a facility.
- Swipe the bunker horizontally and vertically to explore. Use **Centre shaft** to return to the ladder and **Overview** to zoom out.
- Tap a room or earth tile to open its controls. Use the bottom **Build**, **People**, **Entrance** and **Supplies** buttons; **Close** or Escape dismisses the control panel.
- The approved simple Haven 17 direction is implemented as small reusable SVG room scenes, civilian portraits, cream labels and bold outlines. The map retains all seven columns and eight floors, including existing saves.
- Use **Recover entrance supplies** for repeatable materials while prototyping.
- Build living quarters before admitting a whole arrival group.
- Entrance choices: permanent admission, 180-active-second temporary shelter, supply aid, or decline. Unresolved arrivals wait indefinitely; new groups appear 120 active seconds after a decision.
- Read the forecast before deciding: beds, food/water arrival costs, ongoing demand, patients and staffed treatment places. The 60-second stock projection assumes admission with current assignments and no construction.
- Assign healthy adults from the resident list. Each production facility needs one worker; matching skills provide +25% output. New arrivals start unassigned.
- Build a clinic and assign a doctor. One clinic treats one patient per second for 1 power and 0.05 medicine; recovery is 0.5 health/second. Injured residents cannot work until fully recovered.
- Exchange 20 materials for 5 medicine through the relief network.
- Temporary guests use beds and supplies and may work; they leave as a group for an evacuation point when their stay ends.
- Pause at any time; construction remains available.
- Saves are local to this browser. Export JSON for backup or moving devices. Import validates the save and asks before replacing the current bunker.

## Implemented
- Seven columns and eight floors with connected excavation rules.
- Generators, water treatment, hydroponics, food stores, water tanks, batteries, living quarters and workshops.
- Deterministic one-second production, consumption, capacities and per-room operating status.
- Named residents, adult/child needs, skills, assignments, injuries and treatment.
- Adults consume 0.12 food/water each second; children consume 0.08. Admission or aid costs 5 food and water per person.
- Atomic group admission prevents splitting families or partially spending supplies.
- Three rotating authored arrival groups. Pending arrivals and guest expiry persist in saves.
- Version-one saves migrate automatically; the old browser save key is retained as a backup.
- Automatic saving after actions and every five active simulation seconds.
- Simulation pauses in hidden tabs. No offline catch-up, absence penalties or resident deaths.
- Accessible named buttons, keyboard focus indicators and touch-sized controls.

## Architecture
- `engine.js`: DOM-independent simulation, commands and save validation; reusable in a future client.
- `app.js`: browser rendering, interactions and persistence.
- `style.css`: responsive cartoon cutaway, mobile control sheet and navigation.
- `assets/`: nine room scenes, six civilian character variants and the surface entrance; all local SVG assets.
- `engine.test.js`: dependency-free simulation regression tests.

Run simulation tests with `node engine.test.js`. GitHub Actions also runs `scripts/verify-ui.mjs` in Chromium and retains screenshots for seven days. The browser script requires Playwright; the game itself has no package dependencies.

## Validation
Sixteen simulation tests passed in a JavaScript runtime during implementation. Application JavaScript syntax was checked. The visual update also passed twelve UI wiring checks using a lightweight DOM shim (map rendering, navigation, excavation, construction, admission, roster refresh, pause/resume, panel closing and saving). These are not browser/layout tests. Automated Chromium checks passed on GitHub for phone-sized (390×844) and desktop (1366×900) layouts, all 16 local SVGs decoding, construction, family admission, disabled child/patient assignments, panel navigation, pause, save reload and overview. See [the successful verification run](https://github.com/williamrobsonncuc-boop/bunker-tycoon/actions/runs/43975924919). Physical-device testing, human visual review and performance profiling remain outstanding.

## Intentional prototype limits
The simple concept-art direction is translated into vector game assets; animation and final visual QA are pending. No animated residents, fatigue/rest cycles, training, sanitation/disease simulation, fuel, maintenance, expeditions, research, cloud saves, monetisation or native packaging yet. The World War 3 setting is narrative context; combat and world events are not simulated. Temporary shelter is an explicit timed onward-evacuation mechanic, not a moral consequence simulator. Production priority is generators, water, farming, workshops, then clinics, using insertion order within each type. Worker assignments are explicit; medical patients are selected automatically in resident order. Unstaffed facilities do not produce. Supply recovery is unlimited to prevent prototype dead ends. Balance is provisional.

## Next milestones
1. Browser and physical-phone QA.
2. Resident movement and rest cycles; room upgrades and maintenance.
3. Progression, research, expeditions and a first-session tutorial.
4. Original visual identity, audio and performance profiling.
5. Select native packaging after the core loop is validated.

## Master development brief

Read [the master development prompt and game bible](docs/MASTER_DEVELOPMENT_PROMPT.md) for the proposed world, cast, Lantern Credits economy, production standards and milestone plan. This planning document distinguishes existing functionality from future proposals; it does not change the playable prototype.


## Current vertical slice update

The shelter now includes a repeatable **Operations & Archive** panel:

- Long-range radio: spend power to decode Civil Defence signals and build morale.
- Salvage sortie: spend power and materials to recover a larger materials cache.
- Civil-defence drill: spend power to improve morale and reveal the Lantern Programme history.
- Perimeter watch: spend power to recover a smaller maintenance cache and surface a new story lead.

Operations have cooldowns, explicit costs, readable standby states and an activity history. The save format migrates older v1/v2 saves to version 3, preserving the existing shelter. The interface now reports a Civil Defence status (secure/stable/strained) and includes an in-world archive for discovered lore.

The visual treatment is moving toward a credible municipal emergency facility: concrete, steel, paper, olive and warning amber, with the high-contrast simple room silhouettes retained for mobile readability. The current art remains an editable prototype kit; final production art, animation and device review are still separate milestones.


## Product pass: home, settings and daily supply

The current build now has a branded Haven 17 command home, an in-world shelter status summary, settings for reduced motion and high contrast, and a daily civil-defence supply drop. Daily drops rotate through materials, food, water and medicine, track a return streak, and can only be claimed once per day. They are deliberately small and resource-aware: returning should feel useful without making the game depend on compulsive notifications.

The interface also uses restrained motion for room life, panel transitions and focus feedback, with a reduced-motion switch for players who need it. The home brief, archive, operations and settings are all data-backed panels rather than decorative screens.
