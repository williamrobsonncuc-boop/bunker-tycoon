# Haven 17 visual assets

Original editable SVG implementations of the simple mobile concept approved in the project conversation: thick charcoal contours, cream labels, warm peach quarters, sage farming, amber generators, aqua water systems and coral clinic accents.

- `rooms/`: one local SVG scene per room type. Interfaces and state remain live HTML, not a flattened concept-art screenshot.
- `characters/`: profession-based civilian avatars, shared between the map, resident list and arrival cards.
- `surface.svg`: scalable wartime skyline and civilian bunker entrance.
- All art is local, resolution independent and has no external font/image dependencies.
- Residents appear in working rooms only when a healthy adult is assigned. Quarters show resident portraits as a housing illustration.
- Portraits are static and shared by profession; they are not yet unique likenesses, movement, or a detailed housing simulation.
- The original seven-column/eight-floor simulation and existing saves are retained. Detail view pans horizontally; Overview provides a smaller map view.
- Browser visual inspection, physical-device testing, contrast measurement and performance profiling remain outstanding.

This is a first implemented visual direction. Runtime UI labels and controls remain separate so counters, room status, accessibility names and actions reflect actual game state.
