# Haven 17 real-device playtest checklist

Automated checks cover the simulation and Chromium layouts. Before calling the game release-ready, test the live build on:

- iPhone SE / 390px portrait
- iPhone Pro Max / 430px portrait
- Android 360–412px portrait
- iPad or Android tablet portrait
- Tablet landscape

## Core smoke pass

1. Open Home and continue to the shelter.
2. Tap every dock item: Build, People, Entrance, Alerts, Operations, Supplies and Settings.
3. Excavate sideways and down, then build and select every room type.
4. Assign, unassign and reassign residents.
5. Admit, temporarily shelter, supply and decline an arriving group.
6. Claim a daily drop and run every available operation.
7. Resolve an alert and a resident request.
8. Export a save, reload the page, then import the save.
9. Enable reduced motion and high contrast.
10. Rotate the device or resize the browser while a panel is open.

## Visual checks

- No horizontal page scroll outside the bunker map.
- Room titles and status labels remain readable at the smallest width.
- Residents do not disappear behind room texture layers.
- Buttons remain at least finger-sized and do not sit behind the bottom dock.
- Alerts and arrival cards remain reachable above the dock.
- Animations stop when reduced motion is enabled.
- Sound cues only play after an intentional user action.

## Performance checks

- Leave the game active for ten minutes.
- Scroll the map repeatedly on a phone.
- Open and close panels while the shelter is simulating.
- Watch for dropped frames, growing memory use, repeated alert sounds or duplicated residents.
