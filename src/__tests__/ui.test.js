import { describe, it, expect, beforeEach, vi } from 'vitest'
import { showZonePanel, hideZonePanel, renderPlaysLibrary, showPlayDiagram } from '../ui.js'
import { ZONES } from '../zones.js'
import { PLAYS, THEMES } from '../plays.js'

function setupDOM() {
  document.body.innerHTML = `
    <div id="zone-panel" class="panel panel--hidden">
      <button id="zone-panel-close"></button>
      <h2 id="zone-panel-name"></h2>
      <p id="zone-panel-possession"></p>
      <p id="zone-panel-defence"></p>
      <blockquote id="zone-panel-principle"></blockquote>
    </div>
    <div id="plays-list"></div>
    <div id="play-diagram"></div>
    <div id="play-detail"></div>
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

describe('renderPlaysLibrary', () => {
  beforeEach(setupDOM)

  it('renders a section for each theme that has plays', () => {
    renderPlaysLibrary(PLAYS, THEMES, '2-4-2', () => {})
    const sections = document.querySelectorAll('#plays-list .plays-theme')
    expect(sections.length).toBeGreaterThan(0)
  })

  it('renders a button for each play', () => {
    renderPlaysLibrary(PLAYS, THEMES, '2-4-2', () => {})
    const buttons = document.querySelectorAll('#plays-list .play-item')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('calls the callback with the play id when a play button is clicked', () => {
    const onSelect = vi.fn()
    renderPlaysLibrary(PLAYS, THEMES, '2-4-2', onSelect)
    const firstButton = document.querySelector('#plays-list .play-item')
    firstButton.click()
    expect(onSelect).toHaveBeenCalled()
  })
})

describe('showPlayDiagram', () => {
  beforeEach(setupDOM)

  it('renders the play title', () => {
    showPlayDiagram(PLAYS[0], '2-4-2')
    expect(document.getElementById('play-detail').textContent).toContain(PLAYS[0].title)
  })

  it('renders the coaching point', () => {
    showPlayDiagram(PLAYS[0], '2-4-2')
    expect(document.getElementById('play-detail').textContent).toContain(PLAYS[0].coachingPoint)
  })

  it('renders all steps', () => {
    showPlayDiagram(PLAYS[0], '2-4-2')
    for (const step of PLAYS[0].steps) {
      expect(document.getElementById('play-detail').textContent).toContain(step)
    }
  })
})
