import { describe, it, expect } from 'vitest'
import {
  FORMATIONS,
  ZONE_RECTS,
  getFormation,
  getPlayersByFormation,
} from '../formations.js'

describe('ZONE_RECTS', () => {
  it('contains exactly 9 zone rectangles', () => {
    expect(Object.keys(ZONE_RECTS)).toHaveLength(9)
  })

  it('each rect has x, y, w, h', () => {
    for (const rect of Object.values(ZONE_RECTS)) {
      expect(rect).toHaveProperty('x')
      expect(rect).toHaveProperty('y')
      expect(rect).toHaveProperty('w')
      expect(rect).toHaveProperty('h')
    }
  })

  it('zone 1 is top-left (attacking, left channel)', () => {
    expect(ZONE_RECTS[1].x).toBe(0)
    expect(ZONE_RECTS[1].y).toBe(0)
  })

  it('zone 9 is bottom-right (defensive, right channel)', () => {
    expect(ZONE_RECTS[9].x).toBe(200)
    expect(ZONE_RECTS[9].y).toBe(133)
  })
})

describe('FORMATIONS', () => {
  it('has 2-4-2 and 3-4-1', () => {
    expect(FORMATIONS['2-4-2']).toBeDefined()
    expect(FORMATIONS['3-4-1']).toBeDefined()
  })

  it('each formation has a name and players array', () => {
    for (const f of Object.values(FORMATIONS)) {
      expect(f).toHaveProperty('name')
      expect(Array.isArray(f.players)).toBe(true)
    }
  })

  it('2-4-2 has 9 players', () => {
    expect(FORMATIONS['2-4-2'].players).toHaveLength(9)
  })

  it('3-4-1 has 9 players', () => {
    expect(FORMATIONS['3-4-1'].players).toHaveLength(9)
  })

  it('each player has id, label, x, y, primaryZones', () => {
    for (const f of Object.values(FORMATIONS)) {
      for (const p of f.players) {
        expect(p).toHaveProperty('id')
        expect(p).toHaveProperty('label')
        expect(p).toHaveProperty('x')
        expect(p).toHaveProperty('y')
        expect(Array.isArray(p.primaryZones)).toBe(true)
      }
    }
  })

  it('2-4-2 includes a CDM player', () => {
    const cdm = FORMATIONS['2-4-2'].players.find(p => p.id === 'CDM')
    expect(cdm).toBeDefined()
    expect(cdm.note).toMatch(/holding|deeper|defensive/i)
  })
})

describe('getFormation', () => {
  it('returns the formation for a valid key', () => {
    expect(getFormation('2-4-2').name).toBe('2-4-2')
  })

  it('returns undefined for unknown formation', () => {
    expect(getFormation('4-4-2')).toBeUndefined()
  })
})

describe('getPlayersByFormation', () => {
  it('returns the players array for the formation', () => {
    const players = getPlayersByFormation('3-4-1')
    expect(players).toHaveLength(9)
  })

  it('returns empty array for unknown formation', () => {
    expect(getPlayersByFormation('4-4-2')).toEqual([])
  })
})
