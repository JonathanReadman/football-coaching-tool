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
