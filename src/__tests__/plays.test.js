import { describe, it, expect } from 'vitest'
import { PLAYS, getPlay, getPlaysByTheme, THEMES } from '../plays.js'

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
      expect(play).toHaveProperty('arrows')
      expect(play).toHaveProperty('playerOverrides')
      expect(Array.isArray(play.steps)).toBe(true)
      expect(Array.isArray(play.arrows)).toBe(true)
      expect(play.steps.length).toBeGreaterThan(0)
    }
  })

  it('each arrow has from, to, and type', () => {
    for (const play of PLAYS) {
      for (const arrow of play.arrows) {
        expect(arrow).toHaveProperty('from')
        expect(arrow).toHaveProperty('to')
        expect(arrow).toHaveProperty('type')
        expect(['ball', 'run', 'pass']).toContain(arrow.type)
        expect(arrow.from).toHaveProperty('x')
        expect(arrow.from).toHaveProperty('y')
        expect(arrow.to).toHaveProperty('x')
        expect(arrow.to).toHaveProperty('y')
      }
    }
  })

  it('formations references valid formation keys', () => {
    const validFormations = ['2-4-2', '3-4-1', 'both']
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
