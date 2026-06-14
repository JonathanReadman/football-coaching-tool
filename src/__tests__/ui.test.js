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

  it('does not throw when stepIndex is out of bounds', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    const svg = document.querySelector('#play-diagram svg')
    expect(() => renderPlayStep(svg, PLAYS[0], 999, '2-4-2')).not.toThrow()
  })

  it('does not throw when formation has no positions for that step', () => {
    showPlayView(PLAYS[0], '2-4-2', () => {})
    const svg = document.querySelector('#play-diagram svg')
    // PLAYS[0] only supports '2-4-2', so '3-4-1' has no positions
    expect(() => renderPlayStep(svg, PLAYS[0], 0, '3-4-1')).not.toThrow()
  })
})
