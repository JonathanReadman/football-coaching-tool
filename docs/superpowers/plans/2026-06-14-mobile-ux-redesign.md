# Mobile UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cramped top-nav app with a bottom tab bar, compact zone bottom sheet, and an animated step-through plays view where player dots move smoothly across the pitch.

**Architecture:** Bottom tab bar replaces the `<header>` nav. Zone panel becomes a CSS bottom sheet that slides up to ~55% height while keeping the pitch visible. The plays view is restructured: a scrollable list leads to a full-screen play view where per-step player positions are animated with CSS transitions. `src/pdf.js` and `styles/print.css` are deleted (print button removed).

**Tech Stack:** Vanilla JS ES modules, SVG viewBox `0 0 300 200`, CSS custom properties, CSS `transform: translateY` for bottom sheet, CSS `transition: transform 0.5s ease-in-out` on `[data-player]` groups for player animation. Vitest + jsdom for tests.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/plays.js` | Modify | Replace `arrows`/`playerOverrides` with `steps[]` (each step has `description` + per-formation `positions`) |
| `src/pitch.js` | Modify | Add `updatePlayerPositions(svg, positions)` |
| `src/ui.js` | Modify | Remove `renderPlaysLibrary`, `showPlayDiagram`, `_renderArrows`. Add `renderPlaysView`, `showPlayView`, `renderPlayStep` |
| `src/main.js` | Modify | Remove pdf import, wire tab bar + play view navigation |
| `src/pdf.js` | **Delete** | Print functionality removed |
| `index.html` | Modify | Replace `<header>` + print btn with bottom tab bar; restructure plays view HTML |
| `styles/main.css` | Modify | Add tab bar, bottom sheet, play view styles; remove old mobile stacking |
| `styles/print.css` | **Delete** | No longer needed |
| `src/__tests__/plays.test.js` | Modify | Update assertions to match new `steps[]` shape |
| `src/__tests__/pitch.test.js` | Modify | Add `updatePlayerPositions` tests |
| `src/__tests__/ui.test.js` | Modify | Replace `renderPlaysLibrary`/`showPlayDiagram` tests with new function tests |

---

## Coordinate Reference

SVG viewBox: `0 0 300 200`. Our team defends bottom (high y), attacks top (low y).

**2-4-2 default positions:**
```
GK: {x:150,y:188}  LB: {x:55,y:163}   RB: {x:245,y:163}
LM: {x:25,y:100}   CDM:{x:110,y:115}  CM: {x:190,y:88}
RM: {x:275,y:100}  LF: {x:65,y:28}    RF: {x:235,y:28}
```

**3-4-1 default positions:**
```
GK:  {x:150,y:188}  LCB:{x:65,y:158}   CB: {x:150,y:163}
RCB: {x:235,y:158}  LM: {x:25,y:100}   CM: {x:110,y:95}
CM2: {x:190,y:95}   RM: {x:275,y:100}  AM: {x:150,y:33}
```

---

## Task 1: Migrate plays data to step-based model

**Files:**
- Modify: `src/plays.js`
- Modify: `src/__tests__/plays.test.js`

Each play's `arrows` and `playerOverrides` fields are replaced by a `steps` array. Each step is `{ description: string, positions: { [formation]: { [playerId]: {x, y} } } }`. The `renderPlayStep` function (Task 3) reads `step.positions[formation]`.

- [ ] **Step 1: Write the failing test**

Replace the entire contents of `src/__tests__/plays.test.js` with:

```js
import { describe, it, expect } from 'vitest'
import { PLAYS, getPlay, getPlaysByTheme, THEMES } from '../plays.js'
import { FORMATIONS } from '../formations.js'

describe('PLAYS', () => {
  it('has at least 6 plays', () => {
    expect(PLAYS.length).toBeGreaterThanOrEqual(6)
  })

  it('each play has required fields', () => {
    for (const play of PLAYS) {
      expect(play).toHaveProperty('id')
      expect(play).toHaveProperty('title')
      expect(play).toHaveProperty('theme')
      expect(play).toHaveProperty('formations')
      expect(play).toHaveProperty('steps')
      expect(play).toHaveProperty('coachingPoint')
      expect(Array.isArray(play.steps)).toBe(true)
      expect(play.steps.length).toBeGreaterThan(0)
    }
  })

  it('play has no arrows or playerOverrides fields', () => {
    for (const play of PLAYS) {
      expect(play).not.toHaveProperty('arrows')
      expect(play).not.toHaveProperty('playerOverrides')
    }
  })

  it('each step has a description and positions object', () => {
    for (const play of PLAYS) {
      for (const step of play.steps) {
        expect(typeof step.description).toBe('string')
        expect(step.description.length).toBeGreaterThan(0)
        expect(typeof step.positions).toBe('object')
        expect(step.positions).not.toBeNull()
      }
    }
  })

  it('each step positions covers all formations the play supports', () => {
    for (const play of PLAYS) {
      for (const step of play.steps) {
        for (const formation of play.formations) {
          expect(step.positions).toHaveProperty(formation)
          const posMap = step.positions[formation]
          const playerIds = FORMATIONS[formation].players.map(p => p.id)
          for (const id of playerIds) {
            expect(posMap).toHaveProperty(id)
            expect(typeof posMap[id].x).toBe('number')
            expect(typeof posMap[id].y).toBe('number')
          }
        }
      }
    }
  })

  it('formations references valid formation keys', () => {
    const validFormations = ['2-4-2', '3-4-1']
    for (const play of PLAYS) {
      for (const f of play.formations) {
        expect(validFormations).toContain(f)
      }
    }
  })
})

describe('THEMES', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(THEMES)).toBe(true)
    expect(THEMES.length).toBeGreaterThan(0)
    for (const t of THEMES) {
      expect(typeof t).toBe('string')
    }
  })
})

describe('getPlay', () => {
  it('returns the play with the given id', () => {
    const first = PLAYS[0]
    expect(getPlay(first.id)).toEqual(first)
  })

  it('returns undefined for unknown id', () => {
    expect(getPlay('nonexistent')).toBeUndefined()
  })
})

describe('getPlaysByTheme', () => {
  it('returns only plays matching the theme', () => {
    const theme = PLAYS[0].theme
    const result = getPlaysByTheme(theme)
    expect(result.length).toBeGreaterThan(0)
    for (const p of result) {
      expect(p.theme).toBe(theme)
    }
  })

  it('returns empty array for unknown theme', () => {
    expect(getPlaysByTheme('Unknown Theme')).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/plays.test.js
```

Expected: FAIL — tests for `arrows`/`playerOverrides` removal and `steps[].positions` shape.

- [ ] **Step 3: Replace `src/plays.js` with the new step-based data**

```js
export const THEMES = [
  'Building from the back',
  'Pressing triggers',
  'Wide combinations',
  'Central overloads',
]

// Helpers — default player positions reused across steps
const D242 = {
  GK:  { x: 150, y: 188 }, LB:  { x: 55,  y: 163 }, RB:  { x: 245, y: 163 },
  LM:  { x: 25,  y: 100 }, CDM: { x: 110, y: 115 }, CM:  { x: 190, y: 88  },
  RM:  { x: 275, y: 100 }, LF:  { x: 65,  y: 28  }, RF:  { x: 235, y: 28  },
}
const D341 = {
  GK:  { x: 150, y: 188 }, LCB: { x: 65,  y: 158 }, CB:  { x: 150, y: 163 },
  RCB: { x: 235, y: 158 }, LM:  { x: 25,  y: 100 }, CM:  { x: 110, y: 95  },
  CM2: { x: 190, y: 95  }, RM:  { x: 275, y: 100 }, AM:  { x: 150, y: 33  },
}

export const PLAYS = [
  {
    id: 'build-back-gk-lb',
    title: 'GK plays short to LB under pressure',
    theme: 'Building from the back',
    formations: ['2-4-2'],
    coachingPoint:
      'Playing short from the GK drags the opposition press higher and creates space in behind them. The CDM always gives the defenders a central option — never leave them with only wide passes.',
    steps: [
      {
        description: 'Opposition press high — GK has the ball.',
        positions: { '2-4-2': { ...D242 } },
      },
      {
        description: 'LB drops into zone 7 and shows for the pass.',
        positions: { '2-4-2': { ...D242, LB: { x: 55, y: 172 } } },
      },
      {
        description: 'GK plays short to LB. LM pushes wide in zone 4 as an outlet.',
        positions: { '2-4-2': { ...D242, LB: { x: 55, y: 163 }, LM: { x: 20, y: 82 } } },
      },
      {
        description: 'LB receives, turns, plays to LM. CDM drops as a safety option.',
        positions: { '2-4-2': { ...D242, LM: { x: 20, y: 72 }, CDM: { x: 130, y: 152 } } },
      },
    ],
  },
  {
    id: 'build-back-cb-switch',
    title: 'CB switches play from left to right (3-4-1)',
    theme: 'Building from the back',
    formations: ['3-4-1'],
    coachingPoint:
      'Switching play quickly exploits the space on the weak side of the press. The CB must be confident on the ball — this is a key technical challenge for defenders at U12.',
    steps: [
      {
        description: 'Opposition press the left side — LCB has the ball.',
        positions: { '3-4-1': { ...D341 } },
      },
      {
        description: 'CB moves centrally to offer a pass option.',
        positions: { '3-4-1': { ...D341, CB: { x: 100, y: 160 } } },
      },
      {
        description: 'CB plays a long switch to RCB who is free. RM pushes up.',
        positions: { '3-4-1': { ...D341, RM: { x: 275, y: 78 } } },
      },
      {
        description: 'RCB plays to RM in zone 6. Team shifts right to support.',
        positions: { '3-4-1': { ...D341, RM: { x: 275, y: 58 }, CM2: { x: 215, y: 90 }, AM: { x: 200, y: 30 } } },
      },
    ],
  },
  {
    id: 'press-trigger-gk',
    title: 'Pressing trigger — GK plays long',
    theme: 'Pressing triggers',
    formations: ['2-4-2', '3-4-1'],
    coachingPoint:
      'A pressing trigger is a visual cue for the whole team to press together. Without a trigger, individual pressing leaves gaps. Agree the trigger in training so every player knows their job.',
    steps: [
      {
        description: 'LF closes down the CB. Signal: LF raises their arm.',
        positions: { '2-4-2': { ...D242 }, '3-4-1': { ...D341 } },
      },
      {
        description: 'On the signal, the whole team steps up 10 yards.',
        positions: {
          '2-4-2': {
            GK: { x: 150, y: 170 }, LB: { x: 55, y: 145 }, RB: { x: 245, y: 145 },
            LM: { x: 25, y: 82 }, CDM: { x: 110, y: 97 }, CM: { x: 190, y: 70 },
            RM: { x: 275, y: 82 }, LF: { x: 65, y: 12 }, RF: { x: 235, y: 12 },
          },
          '3-4-1': {
            GK: { x: 150, y: 170 }, LCB: { x: 65, y: 140 }, CB: { x: 150, y: 145 },
            RCB: { x: 235, y: 140 }, LM: { x: 25, y: 82 }, CM: { x: 110, y: 77 },
            CM2: { x: 190, y: 77 }, RM: { x: 275, y: 82 }, AM: { x: 150, y: 15 },
          },
        },
      },
      {
        description: 'CB plays long — LB positions to win the header in zone 7.',
        positions: {
          '2-4-2': {
            GK: { x: 150, y: 170 }, LB: { x: 55, y: 138 }, RB: { x: 245, y: 145 },
            LM: { x: 25, y: 82 }, CDM: { x: 110, y: 97 }, CM: { x: 190, y: 70 },
            RM: { x: 275, y: 82 }, LF: { x: 65, y: 12 }, RF: { x: 235, y: 12 },
          },
          '3-4-1': {
            GK: { x: 150, y: 170 }, LCB: { x: 65, y: 138 }, CB: { x: 150, y: 145 },
            RCB: { x: 235, y: 140 }, LM: { x: 25, y: 82 }, CM: { x: 110, y: 77 },
            CM2: { x: 190, y: 77 }, RM: { x: 275, y: 82 }, AM: { x: 150, y: 15 },
          },
        },
      },
      {
        description: 'CDM covers behind LB — ready to collect the second ball.',
        positions: {
          '2-4-2': {
            GK: { x: 150, y: 170 }, LB: { x: 55, y: 138 }, RB: { x: 245, y: 145 },
            LM: { x: 25, y: 82 }, CDM: { x: 95, y: 152 }, CM: { x: 190, y: 70 },
            RM: { x: 275, y: 82 }, LF: { x: 65, y: 12 }, RF: { x: 235, y: 12 },
          },
          '3-4-1': {
            GK: { x: 150, y: 170 }, LCB: { x: 65, y: 138 }, CB: { x: 150, y: 145 },
            RCB: { x: 235, y: 140 }, LM: { x: 25, y: 82 }, CM: { x: 95, y: 150 },
            CM2: { x: 190, y: 77 }, RM: { x: 275, y: 82 }, AM: { x: 150, y: 15 },
          },
        },
      },
    ],
  },
  {
    id: 'press-trigger-back-pass',
    title: 'Pressing trigger — back pass to GK',
    theme: 'Pressing triggers',
    formations: ['2-4-2', '3-4-1'],
    coachingPoint:
      'A back pass to the GK is a moment of weakness — the opposition have run out of ideas. Win the ball high here and you are in a great position to score.',
    steps: [
      {
        description: 'Trigger: opposition defender plays back to their GK.',
        positions: { '2-4-2': { ...D242 }, '3-4-1': { ...D341 } },
      },
      {
        description: 'LF sprints to close the GK — angle the run to block the easy pass.',
        positions: {
          '2-4-2': { ...D242, LF: { x: 140, y: 12 } },
          '3-4-1': { ...D341, AM: { x: 140, y: 12 } },
        },
      },
      {
        description: 'LM and CM press the nearest options to cut off easy exits.',
        positions: {
          '2-4-2': { ...D242, LF: { x: 140, y: 12 }, LM: { x: 28, y: 75 }, CDM: { x: 130, y: 95 } },
          '3-4-1': { ...D341, AM: { x: 140, y: 12 }, LM: { x: 28, y: 75 }, CM: { x: 130, y: 72 } },
        },
      },
      {
        description: 'Force the GK to play long or make a mistake. Rest of team holds shape.',
        positions: {
          '2-4-2': { ...D242, LF: { x: 150, y: 10 }, LM: { x: 28, y: 75 }, CDM: { x: 130, y: 95 } },
          '3-4-1': { ...D341, AM: { x: 150, y: 10 }, LM: { x: 28, y: 75 }, CM: { x: 130, y: 72 } },
        },
      },
    ],
  },
  {
    id: 'wide-combo-overlap',
    title: 'Overlapping run — LM overlaps LF',
    theme: 'Wide combinations',
    formations: ['2-4-2'],
    coachingPoint:
      'The overlap creates a 2v1 against the opposing full-back. The key is timing — LM must not run too early. LF must hold the ball long enough for LM to get past.',
    steps: [
      {
        description: 'LF receives the ball in zone 1 with their back to goal.',
        positions: { '2-4-2': { ...D242 } },
      },
      {
        description: 'LM makes an overlapping run down the touchline. LF holds the ball.',
        positions: { '2-4-2': { ...D242, LM: { x: 10, y: 42 } } },
      },
      {
        description: 'LF lays off to the overlapping LM as they go past.',
        positions: { '2-4-2': { ...D242, LM: { x: 10, y: 20 }, LF: { x: 65, y: 38 } } },
      },
      {
        description: 'LM delivers an early cross into zone 2 for the forwards.',
        positions: { '2-4-2': { ...D242, LM: { x: 8, y: 8 }, LF: { x: 65, y: 38 }, RF: { x: 135, y: 18 } } },
      },
    ],
  },
  {
    id: 'central-overload-cdm',
    title: 'CDM drops to create 3v2 in central midfield',
    theme: 'Central overloads',
    formations: ['2-4-2'],
    coachingPoint:
      'The CDM dropping deep creates a 3v2 in the build-up — two defenders and the CDM against the two opposition forwards. This gives the team a numerical advantage to play through the press.',
    steps: [
      {
        description: 'LB has the ball in zone 7.',
        positions: { '2-4-2': { ...D242 } },
      },
      {
        description: 'CDM drops into zone 8 between the two defenders.',
        positions: { '2-4-2': { ...D242, CDM: { x: 130, y: 158 } } },
      },
      {
        description: 'LB plays into CDM. CM makes a run from zone 5 into zone 2.',
        positions: { '2-4-2': { ...D242, CDM: { x: 130, y: 158 }, CM: { x: 190, y: 65 } } },
      },
      {
        description: 'CDM plays through ball to CM arriving in the attacking zone.',
        positions: { '2-4-2': { ...D242, CDM: { x: 130, y: 158 }, CM: { x: 178, y: 38 } } },
      },
    ],
  },
]

/** @param {string} id */
export function getPlay(id) {
  return PLAYS.find(p => p.id === id)
}

/** @param {string} theme */
export function getPlaysByTheme(theme) {
  return PLAYS.filter(p => p.theme === theme)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/plays.test.js
```

Expected: All tests PASS.

- [ ] **Step 5: Run full suite to confirm no regressions**

```bash
npm test
```

Expected: All tests pass. Note: `ui.test.js` will fail because `showPlayDiagram` references `play.arrows` — this is expected and will be fixed in Task 3. If it fails only in ui.test.js, that's fine for now; if other test files fail, investigate.

- [ ] **Step 6: Commit**

```bash
git add src/plays.js src/__tests__/plays.test.js
git commit -m "feat: migrate plays data to step-based animation model"
```

---

## Task 2: Add `updatePlayerPositions` to pitch.js

**Files:**
- Modify: `src/pitch.js`
- Modify: `src/__tests__/pitch.test.js`

`updatePlayerPositions(svg, positions)` takes an SVG element and a `{ [playerId]: {x, y} }` map. For each entry, it finds the `<g data-player="ID">` group and updates its `transform` attribute. Players not in the map are left unchanged.

- [ ] **Step 1: Write the failing test**

Open `src/__tests__/pitch.test.js` and add at the bottom (after existing tests):

```js
import { updatePlayerPositions } from '../pitch.js'

describe('updatePlayerPositions', () => {
  it('updates the transform of a player group', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    updatePlayerPositions(svg, { GK: { x: 100, y: 50 } })
    const gk = svg.querySelector('[data-player="GK"]')
    expect(gk.getAttribute('transform')).toBe('translate(100,50)')
  })

  it('does not throw when player id is not in the svg', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    expect(() => updatePlayerPositions(svg, { FAKE: { x: 10, y: 10 } })).not.toThrow()
  })

  it('updates multiple players in one call', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    updatePlayerPositions(svg, {
      GK:  { x: 10, y: 20 },
      LB:  { x: 30, y: 40 },
    })
    expect(svg.querySelector('[data-player="GK"]').getAttribute('transform')).toBe('translate(10,20)')
    expect(svg.querySelector('[data-player="LB"]').getAttribute('transform')).toBe('translate(30,40)')
  })

  it('leaves unmentioned players unchanged', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const rbBefore = svg.querySelector('[data-player="RB"]').getAttribute('transform')
    updatePlayerPositions(svg, { GK: { x: 1, y: 1 } })
    expect(svg.querySelector('[data-player="RB"]').getAttribute('transform')).toBe(rbBefore)
  })
})
```

Also update the import at the top of the file to include `updatePlayerPositions`:
```js
import { createPitchSVG, updatePlayerPositions } from '../pitch.js'
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/pitch.test.js
```

Expected: FAIL — `updatePlayerPositions is not a function`.

- [ ] **Step 3: Add `updatePlayerPositions` to `src/pitch.js`**

Add this function at the end of `src/pitch.js` (after `createPitchSVG`):

```js
/**
 * Move player tokens to new positions. Each entry in positions maps a player id
 * to an {x, y} coordinate. Players not listed are left unchanged.
 * @param {SVGElement} svg
 * @param {Record<string, {x: number, y: number}>} positions
 */
export function updatePlayerPositions(svg, positions) {
  for (const [id, pos] of Object.entries(positions)) {
    const g = svg.querySelector(`[data-player="${id}"]`)
    if (g) g.setAttribute('transform', `translate(${pos.x},${pos.y})`)
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/pitch.test.js
```

Expected: All tests PASS.

**Note:** The existing player tokens in `createPitchSVG` use `cx`/`cy` on the circle and `x`/`y` on the text. When `updatePlayerPositions` sets `transform="translate(x,y)"` on the `<g>`, the circle and text inside will move relative to their original coordinates. To make this work cleanly, the circle and text inside each `<g>` must be rendered at `cx=0 cy=0` and `x=0 y=4` respectively, with the `<g>` itself translated to the player's position.

Update `createPitchSVG` in `src/pitch.js` to render player groups this way:

```js
  // Player tokens — circle and label at (0,0) inside the group; group is translated to position
  const players = getPlayersByFormation(formation)
  for (const player of players) {
    const g = svgEl('g', {
      'data-player': player.id,
      transform: `translate(${player.x},${player.y})`,
    })
    g.appendChild(svgEl('circle', {
      cx: '0', cy: '0', r: '8', class: 'pitch__player',
    }))
    const label = svgEl('text', {
      x: '0', y: '4', 'text-anchor': 'middle', class: 'pitch__player-label',
    })
    label.textContent = player.label
    g.appendChild(label)
    svg.appendChild(g)
  }
```

This replaces the existing player token rendering loop in `createPitchSVG`. After this change, the pitch test assertions about player labels should still pass (labels still render), but the existing snapshot test (if any) may need updating — check and update it.

- [ ] **Step 5: Run full suite**

```bash
npm test
```

Expected: All tests pass except `ui.test.js` (which still uses old `showPlayDiagram`/`arrows` — expected, fixed in Task 3).

- [ ] **Step 6: Commit**

```bash
git add src/pitch.js src/__tests__/pitch.test.js
git commit -m "feat: add updatePlayerPositions to pitch, render player groups with transform"
```

---

## Task 3: Rewrite ui.js and its tests

**Files:**
- Modify: `src/ui.js`
- Modify: `src/__tests__/ui.test.js`

Remove `renderPlaysLibrary`, `showPlayDiagram`, `_renderArrows`. Add `renderPlaysView` (plays list), `showPlayView` (full-screen play with step controls), `renderPlayStep` (updates player positions for one step).

`showZonePanel` and `hideZonePanel` are unchanged.

### New HTML structure expected (see Task 4 for the actual HTML):

```
#plays-list        — scrollable list of plays (shown by default in plays view)
#play-view         — full-screen play container (hidden until play selected)
  #play-diagram    — contains the pitch SVG
  #play-step-indicator  — "Step 1 of 4"
  #play-step-description — step text
  #play-back-btn   — returns to #plays-list
  #play-prev-btn   — previous step (disabled at step 0)
  #play-next-btn   — next step (disabled at last step)
```

- [ ] **Step 1: Replace `src/__tests__/ui.test.js`**

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { showZonePanel, hideZonePanel, renderPlaysView, showPlayView, renderPlayStep } from '../ui.js'
import { ZONES } from '../zones.js'
import { PLAYS, THEMES } from '../plays.js'

function setupDOM() {
  document.body.innerHTML = `
    <div id="zone-panel" class="panel panel--hidden">
      <h2 id="zone-panel-name"></h2>
      <p id="zone-panel-possession"></p>
      <p id="zone-panel-defence"></p>
      <blockquote id="zone-panel-principle"></blockquote>
    </div>
    <div id="plays-list"></div>
    <div id="play-view" class="play-view--hidden">
      <div id="play-diagram"></div>
      <p id="play-step-indicator"></p>
      <p id="play-step-description"></p>
      <button id="play-back-btn">Back</button>
      <button id="play-prev-btn">Prev</button>
      <button id="play-next-btn">Next</button>
    </div>
  `
}

describe('showZonePanel', () => {
  beforeEach(setupDOM)

  it('removes panel--hidden class', () => {
    showZonePanel(ZONES[0], '2-4-2')
    expect(document.getElementById('zone-panel').classList.contains('panel--hidden')).toBe(false)
  })

  it('sets the zone name', () => {
    showZonePanel(ZONES[0], '2-4-2')
    expect(document.getElementById('zone-panel-name').textContent).toBe(ZONES[0].name)
  })

  it('sets in-possession text', () => {
    showZonePanel(ZONES[0], '2-4-2')
    expect(document.getElementById('zone-panel-possession').textContent).toBe(ZONES[0].inPossession)
  })

  it('sets out-of-possession text', () => {
    showZonePanel(ZONES[0], '2-4-2')
    expect(document.getElementById('zone-panel-defence').textContent).toBe(ZONES[0].outOfPossession)
  })

  it('sets coaching principle', () => {
    showZonePanel(ZONES[0], '2-4-2')
    expect(document.getElementById('zone-panel-principle').textContent).toBe(ZONES[0].coachingPrinciple)
  })
})

describe('hideZonePanel', () => {
  beforeEach(setupDOM)

  it('adds panel--hidden class', () => {
    document.getElementById('zone-panel').classList.remove('panel--hidden')
    hideZonePanel()
    expect(document.getElementById('zone-panel').classList.contains('panel--hidden')).toBe(true)
  })
})

describe('renderPlaysView', () => {
  beforeEach(setupDOM)

  it('renders a section for each theme that has matching plays', () => {
    renderPlaysView(PLAYS, THEMES, '2-4-2', () => {})
    const sections = document.querySelectorAll('#plays-list .plays-theme')
    expect(sections.length).toBeGreaterThan(0)
  })

  it('renders a button for each matching play', () => {
    renderPlaysView(PLAYS, THEMES, '2-4-2', () => {})
    const buttons = document.querySelectorAll('#plays-list .play-item')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('only renders plays for the active formation', () => {
    renderPlaysView(PLAYS, THEMES, '3-4-1', () => {})
    const buttons = document.querySelectorAll('#plays-list .play-item')
    const titles = Array.from(buttons).map(b => b.textContent)
    // '3-4-1' plays only
    const expectedTitles = PLAYS
      .filter(p => p.formations.includes('3-4-1'))
      .map(p => p.title)
    for (const t of expectedTitles) {
      expect(titles).toContain(t)
    }
  })

  it('calls the onPlaySelect callback with play id when a play is tapped', () => {
    const onSelect = vi.fn()
    renderPlaysView(PLAYS, THEMES, '2-4-2', onSelect)
    document.querySelector('#plays-list .play-item').click()
    expect(onSelect).toHaveBeenCalledWith(expect.any(String))
  })
})

describe('showPlayView', () => {
  beforeEach(setupDOM)

  it('hides #plays-list and shows #play-view', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    expect(document.getElementById('plays-list').classList.contains('hidden')).toBe(true)
    expect(document.getElementById('play-view').classList.contains('play-view--hidden')).toBe(false)
  })

  it('renders a pitch SVG into #play-diagram', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    expect(document.querySelector('#play-diagram svg')).not.toBeNull()
  })

  it('shows step 1 of N indicator', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    expect(document.getElementById('play-step-indicator').textContent).toBe(
      `Step 1 of ${PLAYS[0].steps.length}`
    )
  })

  it('shows the first step description', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    expect(document.getElementById('play-step-description').textContent).toBe(
      PLAYS[0].steps[0].description
    )
  })

  it('disables prev button on first step', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    expect(document.getElementById('play-prev-btn').disabled).toBe(true)
  })

  it('enables next button when there are more steps', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    expect(document.getElementById('play-next-btn').disabled).toBe(false)
  })

  it('advances to next step when next btn is clicked', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    document.getElementById('play-next-btn').click()
    expect(document.getElementById('play-step-indicator').textContent).toBe(
      `Step 2 of ${PLAYS[0].steps.length}`
    )
    expect(document.getElementById('play-step-description').textContent).toBe(
      PLAYS[0].steps[1].description
    )
  })

  it('disables next button on last step', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    const nextBtn = document.getElementById('play-next-btn')
    for (let i = 1; i < PLAYS[0].steps.length; i++) nextBtn.click()
    expect(nextBtn.disabled).toBe(true)
  })

  it('goes back to prev step when prev btn is clicked', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    document.getElementById('play-next-btn').click()
    document.getElementById('play-prev-btn').click()
    expect(document.getElementById('play-step-indicator').textContent).toBe(
      `Step 1 of ${PLAYS[0].steps.length}`
    )
  })

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn()
    showPlayView(PLAYS[0], '2-4-2', onBack)
    document.getElementById('play-back-btn').click()
    expect(onBack).toHaveBeenCalled()
  })
})

describe('renderPlayStep', () => {
  beforeEach(setupDOM)

  it('does not throw when called with valid play and step', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    const svg = document.querySelector('#play-diagram svg')
    expect(() => renderPlayStep(svg, PLAYS[0], 0, '2-4-2')).not.toThrow()
  })

  it('updates player transform on the svg', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    const svg = document.querySelector('#play-diagram svg')
    renderPlayStep(svg, PLAYS[0], 1, '2-4-2')
    const step1Positions = PLAYS[0].steps[1].positions['2-4-2']
    const firstPlayerId = Object.keys(step1Positions)[0]
    const pos = step1Positions[firstPlayerId]
    const g = svg.querySelector(`[data-player="${firstPlayerId}"]`)
    expect(g.getAttribute('transform')).toBe(`translate(${pos.x},${pos.y})`)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/ui.test.js
```

Expected: FAIL — `renderPlaysView`, `showPlayView`, `renderPlayStep` not exported.

- [ ] **Step 3: Replace `src/ui.js`**

```js
import { createPitchSVG } from './pitch.js'
import { updatePlayerPositions } from './pitch.js'

/**
 * @param {import('./zones.js').Zone} zone
 * @param {string} formation
 */
export function showZonePanel(zone, formation) { // eslint-disable-line no-unused-vars
  const panel = document.getElementById('zone-panel')
  document.getElementById('zone-panel-name').textContent = zone.name
  document.getElementById('zone-panel-possession').textContent = zone.inPossession
  document.getElementById('zone-panel-defence').textContent = zone.outOfPossession
  document.getElementById('zone-panel-principle').textContent = zone.coachingPrinciple
  panel.classList.remove('panel--hidden')
}

export function hideZonePanel() {
  document.getElementById('zone-panel').classList.add('panel--hidden')
}

/**
 * Render the scrollable plays list grouped by theme.
 * @param {import('./plays.js').Play[]} plays
 * @param {string[]} themes
 * @param {string} formation
 * @param {(playId: string) => void} onPlaySelect
 */
export function renderPlaysView(plays, themes, formation, onPlaySelect) {
  const container = document.getElementById('plays-list')
  container.innerHTML = ''

  for (const theme of themes) {
    const themePlays = plays.filter(p => p.theme === theme && p.formations.includes(formation))
    if (themePlays.length === 0) continue

    const section = document.createElement('div')
    section.className = 'plays-theme'

    const heading = document.createElement('h3')
    heading.textContent = theme
    section.appendChild(heading)

    for (const play of themePlays) {
      const btn = document.createElement('button')
      btn.className = 'play-item'
      btn.textContent = play.title
      btn.addEventListener('click', () => onPlaySelect(play.id))
      section.appendChild(btn)
    }

    container.appendChild(section)
  }
}

/**
 * Show the full-screen animated play view. Manages step state internally.
 * @param {import('./plays.js').Play} play
 * @param {string} formation
 * @param {() => void} onBack
 */
export function showPlayView(play, formation, onBack) {
  const listEl = document.getElementById('plays-list')
  const viewEl = document.getElementById('play-view')
  const diagramEl = document.getElementById('play-diagram')
  const indicatorEl = document.getElementById('play-step-indicator')
  const descriptionEl = document.getElementById('play-step-description')
  const backBtn = document.getElementById('play-back-btn')
  const prevBtn = document.getElementById('play-prev-btn')
  const nextBtn = document.getElementById('play-next-btn')

  listEl.classList.add('hidden')
  viewEl.classList.remove('play-view--hidden')

  diagramEl.innerHTML = ''
  const svg = createPitchSVG(formation, null, () => {})
  diagramEl.appendChild(svg)

  let currentStep = 0

  function updateStep(index) {
    currentStep = index
    const step = play.steps[currentStep]
    indicatorEl.textContent = `Step ${currentStep + 1} of ${play.steps.length}`
    descriptionEl.textContent = step.description
    prevBtn.disabled = currentStep === 0
    nextBtn.disabled = currentStep === play.steps.length - 1
    renderPlayStep(svg, play, currentStep, formation)
  }

  // Replace event listeners by cloning the buttons
  const newPrev = prevBtn.cloneNode(true)
  const newNext = nextBtn.cloneNode(true)
  const newBack = backBtn.cloneNode(true)
  prevBtn.replaceWith(newPrev)
  nextBtn.replaceWith(newNext)
  backBtn.replaceWith(newBack)

  document.getElementById('play-prev-btn').addEventListener('click', () => {
    if (currentStep > 0) updateStep(currentStep - 1)
  })
  document.getElementById('play-next-btn').addEventListener('click', () => {
    if (currentStep < play.steps.length - 1) updateStep(currentStep + 1)
  })
  document.getElementById('play-back-btn').addEventListener('click', () => {
    viewEl.classList.add('play-view--hidden')
    listEl.classList.remove('hidden')
    onBack()
  })

  updateStep(0)
}

/**
 * Apply the positions for one step to the pitch SVG.
 * @param {SVGElement} svg
 * @param {import('./plays.js').Play} play
 * @param {number} stepIndex
 * @param {string} formation
 */
export function renderPlayStep(svg, play, stepIndex, formation) {
  const step = play.steps[stepIndex]
  if (!step) return
  const positions = step.positions[formation]
  if (!positions) return
  updatePlayerPositions(svg, positions)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/ui.test.js
```

Expected: All tests PASS.

- [ ] **Step 5: Run full suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/ui.js src/__tests__/ui.test.js
git commit -m "feat: rewrite ui.js with animated plays view — renderPlaysView, showPlayView, renderPlayStep"
```

---

## Task 4: Restructure HTML and main.js

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Delete: `src/pdf.js`

Replace `<header>` nav with a bottom tab bar. Restructure the plays view HTML. Remove the print button and pdf.js wiring. Wire up the back button so it returns to the plays list.

- [ ] **Step 1: Delete `src/pdf.js`**

```bash
rm src/pdf.js
git rm src/pdf.js
```

- [ ] **Step 2: Check pdf.js test exists and delete it too**

```bash
ls src/__tests__/pdf.test.js 2>/dev/null && git rm src/__tests__/pdf.test.js || echo "no pdf test"
```

- [ ] **Step 3: Replace `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <title>Coaching Tool — U12s</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>

  <!-- Zone Reference View -->
  <main id="view-zones" class="view view--active">
    <div id="pitch-container" class="pitch-container" aria-label="Tap a zone to learn about it"></div>
    <aside id="zone-panel" class="panel panel--hidden" role="complementary" aria-label="Zone details">
      <div class="panel-handle"></div>
      <h2 id="zone-panel-name" class="panel-title"></h2>
      <section class="panel-section">
        <h3 class="panel-section-title">In Possession</h3>
        <p id="zone-panel-possession"></p>
      </section>
      <section class="panel-section">
        <h3 class="panel-section-title">Out of Possession</h3>
        <p id="zone-panel-defence"></p>
      </section>
      <section class="panel-section">
        <h3 class="panel-section-title">Coaching Principle</h3>
        <blockquote id="zone-panel-principle"></blockquote>
      </section>
    </aside>
  </main>

  <!-- Passages of Play View -->
  <main id="view-plays" class="view view--hidden">
    <nav id="plays-list" class="plays-list" aria-label="Plays library"></nav>
    <div id="play-view" class="play-view play-view--hidden">
      <div id="play-diagram" class="play-diagram" aria-label="Play diagram"></div>
      <div class="play-step-info">
        <p id="play-step-indicator" class="play-step-indicator"></p>
        <p id="play-step-description" class="play-step-description"></p>
      </div>
      <div class="play-controls">
        <button id="play-back-btn" class="play-ctrl-btn play-ctrl-btn--back">← Back</button>
        <button id="play-prev-btn" class="play-ctrl-btn">‹ Prev</button>
        <button id="play-next-btn" class="play-ctrl-btn">Next ›</button>
      </div>
    </div>
  </main>

  <!-- Bottom tab bar -->
  <nav class="tab-bar" aria-label="Main navigation">
    <button class="tab-btn tab-btn--active" data-view="zones">Zones</button>
    <button class="tab-btn" data-view="plays">Plays</button>
    <select id="formation-select" aria-label="Select formation">
      <option value="2-4-2">2-4-2</option>
      <option value="3-4-1">3-4-1</option>
    </select>
  </nav>

  <script type="module" src="src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Replace `src/main.js`**

```js
import { createPitchSVG } from './pitch.js'
import { getZone } from './zones.js'
import { PLAYS, THEMES } from './plays.js'
import { showZonePanel, hideZonePanel, renderPlaysView, showPlayView } from './ui.js'

let currentFormation = '2-4-2'
let activeZoneId = null

function renderPitch() {
  const container = document.getElementById('pitch-container')
  container.innerHTML = ''
  const svg = createPitchSVG(currentFormation, activeZoneId, onZoneClick)
  container.appendChild(svg)
}

function onZoneClick(zoneId) {
  activeZoneId = zoneId
  renderPitch()
  const zone = getZone(zoneId)
  showZonePanel(zone, currentFormation)
}

function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('view--active', v.id === `view-${viewName}`)
    v.classList.toggle('view--hidden', v.id !== `view-${viewName}`)
  })
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('tab-btn--active', btn.dataset.view === viewName)
  })
}

function refreshPlaysView() {
  renderPlaysView(PLAYS, THEMES, currentFormation, (playId) => {
    const play = PLAYS.find(p => p.id === playId)
    if (play) showPlayView(play, currentFormation, () => {})
  })
}

function init() {
  renderPitch()
  refreshPlaysView()

  document.getElementById('pitch-container').addEventListener('click', () => {
    activeZoneId = null
    hideZonePanel()
    renderPitch()
  })

  document.getElementById('formation-select').addEventListener('change', (e) => {
    currentFormation = e.target.value
    activeZoneId = null
    hideZonePanel()
    renderPitch()
    refreshPlaysView()
  })

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.view) switchView(btn.dataset.view)
    })
  })
}

init()
```

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: All tests pass. `src/main.js` is excluded from coverage.

- [ ] **Step 6: Commit**

```bash
git add index.html src/main.js
git commit -m "feat: replace header nav with bottom tab bar, restructure plays view HTML"
```

---

## Task 5: Update styles

**Files:**
- Modify: `styles/main.css`
- Delete: `styles/print.css`

Add: bottom tab bar (48px, fixed bottom), CSS transition for player animation, compact bottom sheet for zone panel (55% height, `translateY` slide), play view (full-screen, flex column), play controls (fixed at bottom). Remove: old mobile panel stacking, `.plays-layout`, `.play-viewer`, `.plays-nav`, `.btn-print`, `.app-title`.

- [ ] **Step 1: Delete `styles/print.css`**

```bash
git rm styles/print.css
```

- [ ] **Step 2: Replace `styles/main.css` entirely**

```css
/* ── Custom properties ── */
:root {
  --pitch-green: #2d6a2d;
  --pitch-line: rgba(255, 255, 255, 0.5);
  --zone-fill: rgba(255, 255, 255, 0.04);
  --zone-hover: rgba(255, 255, 255, 0.12);
  --zone-active: rgba(250, 204, 21, 0.3);
  --zone-stroke: rgba(255, 255, 255, 0.2);
  --accent: #facc15;
  --accent-dark: #ca8a04;
  --bg: #111827;
  --surface: #1f2937;
  --surface-2: #374151;
  --text: #f9fafb;
  --text-secondary: #9ca3af;
  --player-fill: #3b82f6;
  --tab-bar-height: 56px;
  --radius: 8px;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}

/* ── Views ── */
.view {
  display: none;
  height: calc(100dvh - var(--tab-bar-height));
  overflow: hidden;
  position: relative;
}
.view--active { display: flex; }
.view--hidden { display: none; }

/* ── Bottom tab bar ── */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--tab-bar-height);
  background: var(--surface);
  border-top: 1px solid var(--surface-2);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  z-index: 300;
}
.tab-btn {
  flex: 1;
  background: none;
  border: 1px solid var(--surface-2);
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  min-height: 40px;
  transition: background 0.15s, color 0.15s;
}
.tab-btn--active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
  font-weight: 700;
}
#formation-select {
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--surface-2);
  padding: 6px 10px;
  border-radius: var(--radius);
  font-size: 0.875rem;
  min-height: 40px;
  flex-shrink: 0;
}

/* ── Zone Reference View ── */
#view-zones {
  flex-direction: column;
}
.pitch-container {
  flex: 1;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.pitch-container svg {
  width: 100%;
  height: 100%;
  max-height: calc(100dvh - var(--tab-bar-height) - 32px);
  touch-action: manipulation;
}

/* ── Pitch SVG classes ── */
.pitch__bg { fill: var(--pitch-green); }
.pitch__line { stroke: var(--pitch-line); stroke-width: 1; }
.pitch__circle { fill: none; stroke: var(--pitch-line); stroke-width: 1; }
.pitch__zone {
  fill: var(--zone-fill);
  stroke: var(--zone-stroke);
  stroke-width: 0.5;
  cursor: pointer;
  transition: fill 0.15s;
}
.pitch__zone:hover { fill: var(--zone-hover); }
.zone--active { fill: var(--zone-active) !important; stroke: var(--accent); stroke-width: 1.5; }
.pitch__player { fill: var(--player-fill); stroke: #fff; stroke-width: 1; }
.pitch__player-label {
  fill: #fff;
  font-size: 5px;
  font-weight: 700;
  font-family: var(--font);
  pointer-events: none;
}

/* Player animation — CSS handles movement between steps */
[data-player] {
  transition: transform 0.5s ease-in-out;
}

/* ── Zone Panel (bottom sheet) ── */
.panel {
  position: fixed;
  bottom: var(--tab-bar-height);
  left: 0;
  right: 0;
  height: 55dvh;
  background: var(--surface);
  border-top: 2px solid var(--accent);
  border-radius: 16px 16px 0 0;
  padding: 16px 20px 20px;
  overflow-y: auto;
  z-index: 200;
  transform: translateY(0);
  transition: transform 0.25s ease;
}
.panel--hidden {
  transform: translateY(100%);
  pointer-events: none;
}
.panel-handle {
  width: 40px;
  height: 4px;
  background: var(--surface-2);
  border-radius: 2px;
  margin: 0 auto 16px;
}
.panel-title { font-size: 1.1rem; font-weight: 700; color: var(--accent); margin-bottom: 16px; }
.panel-section { margin-bottom: 20px; }
.panel-section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.panel-section p, .panel-section blockquote {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text);
}
blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 12px;
  font-style: italic;
  color: var(--text-secondary);
}

/* ── Passages of Play View ── */
#view-plays {
  flex-direction: column;
  position: relative;
}

/* Plays list */
.plays-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.plays-theme { margin-bottom: 24px; }
.plays-theme h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.play-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: 1px solid var(--surface-2);
  color: var(--text);
  padding: 14px 16px;
  border-radius: var(--radius);
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 8px;
  min-height: 56px;
  transition: background 0.15s;
}
.play-item:hover, .play-item:active { background: var(--surface-2); }

/* Hidden utility used by showPlayView */
.hidden { display: none !important; }

/* Full-screen play view */
.play-view {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}
.play-view--hidden { display: none; }

.play-diagram {
  flex: 0 0 55%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-bottom: 1px solid var(--surface-2);
  overflow: hidden;
}
.play-diagram svg {
  width: 100%;
  height: 100%;
  max-height: 100%;
}

.play-step-info {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.play-step-indicator {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.play-step-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text);
}

.play-controls {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--surface);
  border-top: 1px solid var(--surface-2);
}
.play-ctrl-btn {
  flex: 1;
  background: var(--surface-2);
  border: none;
  color: var(--text);
  padding: 12px;
  border-radius: var(--radius);
  font-size: 0.875rem;
  cursor: pointer;
  min-height: 48px;
  transition: background 0.15s;
}
.play-ctrl-btn:hover { background: var(--surface-2); filter: brightness(1.2); }
.play-ctrl-btn:disabled { opacity: 0.35; cursor: default; }
.play-ctrl-btn--back {
  flex: 0 0 auto;
  background: none;
  border: 1px solid var(--surface-2);
  color: var(--text-secondary);
}

/* ── Tablet (641px – 1024px) ── */
@media (min-width: 641px) {
  /* On wider screens, zone panel appears as a sidebar rather than a full bottom sheet */
  .panel {
    position: static;
    height: auto;
    border-radius: 0;
    border-top: none;
    border-left: 1px solid var(--surface-2);
    transform: none !important;
    transition: none;
    width: 360px;
    flex-shrink: 0;
    overflow-y: auto;
  }
  .panel--hidden { display: none; }
  .panel-handle { display: none; }

  #view-zones { flex-direction: row; }

  /* Plays view splits to sidebar + viewer on tablet */
  #view-plays { flex-direction: row; }
  .plays-list {
    width: 280px;
    flex: none;
    border-right: 1px solid var(--surface-2);
  }
  .play-view {
    position: relative;
    flex: 1;
    inset: auto;
  }
}
```

- [ ] **Step 3: Run full test suite to confirm no regressions**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add styles/main.css styles/print.css
git commit -m "feat: replace header styles with tab bar, bottom sheet zone panel, animated play view"
```

---

## Task 6: Update coverage config and verify all tests pass

**Files:**
- Modify: `vitest.config.js`
- Verify: `src/__tests__/pdf.test.js` is gone (deleted in Task 4)

The `pdf.js` file is deleted and was previously excluded from coverage. Remove any stale references. Verify the coverage thresholds still pass (90% lines/functions/statements, 85% branches).

- [ ] **Step 1: Check current vitest.config.js**

```bash
cat vitest.config.js
```

Look for any reference to `pdf.js` in the exclude list. It will have: `exclude: ['src/__tests__/**', 'src/main.js']`. If `pdf.js` is not in there, nothing to change. If it is, remove it.

- [ ] **Step 2: Run coverage report**

```bash
npm run test:coverage
```

Expected: All thresholds pass — ≥90% lines/functions/statements, ≥85% branches. If coverage drops below threshold due to newly uncovered branches in `ui.js`, check the test for `showPlayView` covers the edge cases (first step, last step, step navigation).

- [ ] **Step 3: Commit (if vitest.config.js was changed)**

Only commit if the file changed:

```bash
git add vitest.config.js
git commit -m "chore: clean up coverage config after pdf.js removal"
```

If nothing changed, skip the commit.

- [ ] **Step 4: Run full suite one final time**

```bash
npm test
```

Expected: All tests pass, no failures.

---

## Notes for implementers

**Coordinate system:** SVG viewBox `0 0 300 200`. Zone 1 (attacking left) is at top-left. Zone 9 (defensive right) is at bottom-right. Our GK is at y≈188. Our forwards are at y≈28.

**Player animation:** The CSS `transition: transform 0.5s ease-in-out` on `[data-player]` is declared in `main.css`. When `updatePlayerPositions` sets a new `transform` attribute, the browser automatically animates the change. No JavaScript animation loop is needed.

**Bottom sheet dismiss:** In `main.js`, a click listener on `#pitch-container` calls `hideZonePanel()`. Zone clicks also propagate up to `#pitch-container`. To prevent the panel from being dismissed immediately when opening (zone click → show panel → event bubbles → dismiss), `onZoneClick` calls `event.stopPropagation()` — but since `createPitchSVG` doesn't expose the event, the click listener uses a brief check: if `activeZoneId` was just set (same tick), skip the dismiss. Simplest approach: add `stopPropagation` to zone click in `pitch.js` by passing the event to the callback, or handle it with a flag in `main.js`.

**Alternative (simpler):** Instead of `stopPropagation`, just ignore pitch-container clicks when the panel is already hidden. In `main.js`:
```js
document.getElementById('pitch-container').addEventListener('click', () => {
  if (!document.getElementById('zone-panel').classList.contains('panel--hidden')) {
    activeZoneId = null
    hideZonePanel()
    renderPitch()
  }
})
```
This is the recommended approach — no event propagation changes needed.

**Existing tests that reference old HTML IDs:** `ui.test.js` uses `setupDOM()` which creates a minimal DOM. The test DOM does not need `#zone-panel-close` (that button is removed in the new HTML). If any existing test references it, remove those assertions.
