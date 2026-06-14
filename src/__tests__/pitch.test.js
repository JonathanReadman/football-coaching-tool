import { describe, it, expect, vi } from 'vitest'
import { createPitchSVG, updatePlayerPositions, drawMovementArrows } from '../pitch.js'

describe('createPitchSVG', () => {
  it('returns an SVGElement', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    expect(svg.tagName.toLowerCase()).toBe('svg')
  })

  it('renders 9 zone rectangles with data-zone attributes', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const zones = svg.querySelectorAll('[data-zone]')
    expect(zones).toHaveLength(9)
    const ids = Array.from(zones).map(z => Number(z.getAttribute('data-zone'))).sort((a, b) => a - b)
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('renders 9 player tokens for 2-4-2', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const players = svg.querySelectorAll('[data-player]')
    expect(players).toHaveLength(9)
  })

  it('renders 9 player tokens for 3-4-1', () => {
    const svg = createPitchSVG('3-4-1', null, () => {})
    const players = svg.querySelectorAll('[data-player]')
    expect(players).toHaveLength(9)
  })

  it('calls onZoneClick with the zone id when a zone rect is clicked', () => {
    const onZoneClick = vi.fn()
    const svg = createPitchSVG('2-4-2', null, onZoneClick)
    const zone5 = svg.querySelector('[data-zone="5"]')
    zone5.dispatchEvent(new Event('click'))
    expect(onZoneClick).toHaveBeenCalledWith(5)
  })

  it('adds active class to the active zone', () => {
    const svg = createPitchSVG('2-4-2', 3, () => {})
    const zone3 = svg.querySelector('[data-zone="3"]')
    expect(zone3.classList.contains('zone--active')).toBe(true)
  })

  it('does not add active class to other zones', () => {
    const svg = createPitchSVG('2-4-2', 3, () => {})
    const zone1 = svg.querySelector('[data-zone="1"]')
    expect(zone1.classList.contains('zone--active')).toBe(false)
  })

  it('includes a CDM label in 2-4-2', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const labels = svg.querySelectorAll('[data-player]')
    const labelTexts = Array.from(labels).map(el => el.querySelector('text')?.textContent)
    expect(labelTexts).toContain('CDM')
  })
})

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
      GK: { x: 10, y: 20 },
      LB: { x: 30, y: 40 },
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

describe('drawMovementArrows', () => {
  it('draws a line for each player that moved', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const from = { GK: { x: 150, y: 188 }, LB: { x: 55, y: 163 } }
    const to   = { GK: { x: 150, y: 188 }, LB: { x: 55, y: 172 } }
    drawMovementArrows(svg, from, to)
    const lines = svg.querySelectorAll('.movement-arrow')
    expect(lines).toHaveLength(1) // GK didn't move; only LB gets an arrow
  })

  it('clears previous arrows before drawing new ones', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const pos1 = { LB: { x: 55, y: 163 } }
    const pos2 = { LB: { x: 55, y: 172 } }
    const pos3 = { LB: { x: 55, y: 185 } }
    drawMovementArrows(svg, pos1, pos2)
    drawMovementArrows(svg, pos2, pos3)
    expect(svg.querySelectorAll('.movement-arrows')).toHaveLength(1)
  })

  it('draws no lines when fromPositions is null (clears only)', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const from = { LB: { x: 55, y: 163 } }
    const to   = { LB: { x: 55, y: 172 } }
    drawMovementArrows(svg, from, to)
    drawMovementArrows(svg, null, to)
    expect(svg.querySelectorAll('.movement-arrow')).toHaveLength(0)
  })

  it('inserts the arrow group before player tokens', () => {
    const svg = createPitchSVG('2-4-2', null, () => {})
    const from = { LB: { x: 55, y: 163 } }
    const to   = { LB: { x: 55, y: 172 } }
    drawMovementArrows(svg, from, to)
    const children = Array.from(svg.children)
    const arrowGroupIdx = children.findIndex(el => el.classList.contains('movement-arrows'))
    const firstPlayerIdx = children.findIndex(el => el.getAttribute('data-player'))
    expect(arrowGroupIdx).toBeLessThan(firstPlayerIdx)
  })
})
