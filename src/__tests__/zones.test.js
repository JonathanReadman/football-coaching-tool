import { describe, it, expect } from 'vitest'
import { ZONES, getZone, getZonesForPosition } from '../zones.js'

describe('ZONES', () => {
  it('contains exactly 9 zones', () => {
    expect(ZONES).toHaveLength(9)
  })

  it('each zone has required fields', () => {
    for (const zone of ZONES) {
      expect(zone).toHaveProperty('id')
      expect(zone).toHaveProperty('name')
      expect(zone).toHaveProperty('third')
      expect(zone).toHaveProperty('channel')
      expect(zone).toHaveProperty('positions')
      expect(zone).toHaveProperty('inPossession')
      expect(zone).toHaveProperty('outOfPossession')
      expect(zone).toHaveProperty('coachingPrinciple')
    }
  })

  it('zone ids are 1 through 9', () => {
    const ids = ZONES.map(z => z.id).sort((a, b) => a - b)
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('each zone has positions for both 2-4-2 and 3-4-1', () => {
    for (const zone of ZONES) {
      expect(zone.positions['2-4-2']).toBeDefined()
      expect(zone.positions['3-4-1']).toBeDefined()
      expect(Array.isArray(zone.positions['2-4-2'])).toBe(true)
      expect(Array.isArray(zone.positions['3-4-1'])).toBe(true)
    }
  })

  it('thirds are one of attacking, midfield, defensive', () => {
    const validThirds = ['attacking', 'midfield', 'defensive']
    for (const zone of ZONES) {
      expect(validThirds).toContain(zone.third)
    }
  })

  it('channels are one of left, central, right', () => {
    const validChannels = ['left', 'central', 'right']
    for (const zone of ZONES) {
      expect(validChannels).toContain(zone.channel)
    }
  })
})

describe('getZone', () => {
  it('returns the zone with the given id', () => {
    const zone = getZone(1)
    expect(zone.id).toBe(1)
    expect(zone.channel).toBe('left')
    expect(zone.third).toBe('attacking')
  })

  it('returns undefined for an invalid id', () => {
    expect(getZone(0)).toBeUndefined()
    expect(getZone(10)).toBeUndefined()
  })
})

describe('getZonesForPosition', () => {
  it('returns zones where the position is listed for the given formation', () => {
    const zones = getZonesForPosition('CDM', '2-4-2')
    expect(zones.length).toBeGreaterThan(0)
    for (const zone of zones) {
      expect(zone.positions['2-4-2']).toContain('CDM')
    }
  })

  it('returns empty array for unknown position', () => {
    expect(getZonesForPosition('UNKNOWN', '2-4-2')).toEqual([])
  })
})
