import { createPitchSVG, updatePlayerPositions, drawMovementArrows } from './pitch.js'

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

  listEl.classList.add('hidden')
  viewEl.classList.remove('play-view--hidden')

  diagramEl.innerHTML = ''
  const svg = createPitchSVG(formation, null, () => {})
  diagramEl.appendChild(svg)

  let currentStep = 0
  let prevPositions = null

  function updateStep(index) {
    currentStep = index
    const step = play.steps[currentStep]
    indicatorEl.textContent = `Step ${currentStep + 1} of ${play.steps.length}`
    descriptionEl.textContent = step.description
    document.getElementById('play-prev-btn').disabled = currentStep === 0
    document.getElementById('play-next-btn').disabled = currentStep === play.steps.length - 1

    const positions = step.positions[formation]
    drawMovementArrows(svg, prevPositions, positions)
    prevPositions = positions ? { ...positions } : null

    renderPlayStep(svg, play, currentStep, formation)
  }

  // Clone buttons to remove any previous event listeners from a prior showPlayView call
  const prevBtn = document.getElementById('play-prev-btn')
  const nextBtn = document.getElementById('play-next-btn')
  const backBtn = document.getElementById('play-back-btn')
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
