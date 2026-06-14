---
name: football-coaching-mobile-ux-redesign
description: Mobile UX redesign for the football coaching visual aid — bottom tab bar, compact zone bottom sheet, animated plays view with step-through player movement
metadata:
  type: project
---

# Football Coaching Tool — Mobile UX Redesign

**Date:** 2026-06-14
**Repository:** https://github.com/JonathanReadman/football-coaching-tool
**Closes:** Phase 2 GitHub Issue #6 (animated passages of play)
**Related:** GitHub Issue #7 (print button removal — already planned, not in scope here)

---

## Summary

The current app is functional but awkward to use one-handed on a phone. This redesign makes it genuinely easy to use at training: a bottom tab bar replaces the cramped top nav, zone coaching content shows in a compact bottom sheet that keeps the pitch visible, and the plays view becomes a full-screen step-through experience with animated player movement.

---

## Section 1 — Navigation

**Replace the top header nav with a bottom tab bar.**

- Two tabs: **Zones** and **Plays**
- Tab bar fixed to the bottom of the screen, always visible
- Formation selector (`2-4-2` / `3-4-1`) moves into the tab bar (right side, inline dropdown)
- App title removed from the header — pitch takes the full vertical space
- Print button removed (tracked separately in Issue #7)
- Minimum tab touch target: 48px height

On desktop/tablet the tab bar remains but the layout reflows to a sidebar — existing responsive behaviour preserved.

---

## Section 2 — Zone Reference View

**Compact bottom sheet that keeps the pitch visible.**

- Pitch SVG fills the top ~45% of the screen
- Tapping a zone slides up a bottom sheet to ~55% height (leaving the pitch + active zone visible above)
- Bottom sheet has a drag handle pill at the top
- Sheet content: zone name, player label(s), In Possession block, Out of Possession block, coaching principle quote
- Tapping outside the sheet (i.e. the pitch) dismisses it
- Sheet uses `transform: translateY` transition for the slide-up/down — no library

The active zone stays highlighted (yellow border) while the sheet is open so the player can see their zone while the coaching point is read out.

---

## Section 3 — Passages of Play View

**Full-width scrollable plays list → full-screen animated play view.**

### Plays list

- Plays grouped by theme with theme name as section heading
- Each play is a large tappable row (minimum 56px height) showing play title and theme badge
- List fills the full screen (below the tab bar)
- No sidebar, no static diagram preview in the list

### Play view (on tap)

Tapping a play pushes a full-screen play view:

- Pitch SVG fills ~55% of the screen height
- Player dots positioned at the starting positions for step 1
- Below the pitch: step indicator (e.g. "Step 2 of 5") + current step description text
- Fixed at the bottom (within thumb reach): **← Back**, **‹ Prev**, **Next ›** buttons
- Back button returns to the plays list
- Prev/Next step through the play's steps array

Player dots animate between steps using CSS transitions (`transform: translate` with `transition: 0.5s ease-in-out`). No arrows, no SVG path drawing — just dots moving smoothly to their new positions.

---

## Section 4 — Animation Data Model

The existing `arrows` field on each play is **retired**. Each play gets a `steps` array where every step defines the full player position map for that moment.

### Play data shape

```js
{
  id: 'build-from-back',
  title: 'Building from the Back',
  theme: 'build-up',
  formations: ['2-4-2', '3-4-1'],
  coachingPoint: 'Always give the keeper a simple option. No long balls under pressure.',
  steps: [
    {
      description: 'GK distributes short to the right CB',
      positions: {
        GK:  { x: 150, y: 185 },
        CB1: { x: 220, y: 160 },
        CB2: { x:  80, y: 160 },
        // ... all players listed even if they don't move
      }
    },
    {
      description: 'CB1 drives forward into Zone 6, CDM drops to offer support',
      positions: {
        GK:  { x: 150, y: 185 },
        CB1: { x: 240, y: 120 },
        CB2: { x:  80, y: 160 },
        // ...
      }
    }
  ]
}
```

Coordinates use the SVG viewBox space (`0 0 300 200`), matching existing `ZONE_RECTS` coordinates in `src/formations.js`.

### Rendering

- Each player is a `<circle>` + `<text>` inside a `<g data-player="ID">` group (already in `src/pitch.js`)
- On step change: update each `<g>` element's `transform` attribute to `translate(x, y)`
- CSS handles the animation: `[data-player] { transition: transform 0.5s ease-in-out; }`
- No `requestAnimationFrame`, no animation library

### Code changes

| File | Change |
|---|---|
| `src/plays.js` | Replace `arrows` + `playerOverrides` with `steps[]` on all 6 plays |
| `src/pitch.js` | Add `updatePlayerPositions(svg, positions)` function |
| `src/ui.js` | Replace `_renderArrows()` with `renderPlayStep(play, stepIndex)` |
| `src/ui.js` | Add `renderPlaysView(plays, themes, formation)` for the new plays list |
| `src/ui.js` | Add `showPlayView(play, formation)` for the full-screen step-through |
| `src/pdf.js` | **Delete** (print button removed) |
| `index.html` | Replace header nav + print btn with bottom tab bar |
| `styles/main.css` | Add tab bar styles, bottom sheet styles, play view styles |
| `styles/print.css` | **Delete** (no longer needed) |

---

## Testing

All existing tests must continue to pass. New tests cover:

- `plays.js`: each play has a `steps` array, each step has a `positions` map covering all players in the formation
- `pitch.js`: `updatePlayerPositions()` moves the correct `<g>` elements
- `ui.js`: `renderPlayStep()` calls `updatePlayerPositions` with the right step data; Prev/Next button state (disabled at first/last step)
- `ui.js`: `renderPlaysView()` groups plays by theme; tapping a play calls `showPlayView`

Coverage thresholds unchanged (90% lines/functions/statements, 85% branches).

---

## Out of Scope

- Free-draw canvas (Phase 2 Issue #1)
- Freehand arrow drawing (Phase 2 Issue #2)
- Formation builder (Phase 2 Issue #3)
- Save/load sessions (Phase 2 Issue #4)
- Share via URL (Phase 2 Issue #5)
- Print/PDF export revisit (Issue #7 — separate piece of work)
