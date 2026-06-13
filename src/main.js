import { createPitchSVG } from './pitch.js'
import { getZone } from './zones.js'
import { PLAYS, THEMES } from './plays.js'
import { showZonePanel, hideZonePanel, renderPlaysLibrary, showPlayDiagram } from './ui.js'
import { triggerPrint } from './pdf.js'

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
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('nav-btn--active', btn.dataset.view === viewName)
  })
}

function init() {
  renderPitch()

  renderPlaysLibrary(PLAYS, THEMES, currentFormation, (playId) => {
    const play = PLAYS.find(p => p.id === playId)
    if (play) showPlayDiagram(play, currentFormation)
  })

  document.getElementById('zone-panel-close').addEventListener('click', () => {
    activeZoneId = null
    hideZonePanel()
    renderPitch()
  })

  document.getElementById('formation-select').addEventListener('change', (e) => {
    currentFormation = e.target.value
    activeZoneId = null
    hideZonePanel()
    renderPitch()
    renderPlaysLibrary(PLAYS, THEMES, currentFormation, (playId) => {
      const play = PLAYS.find(p => p.id === playId)
      if (play) showPlayDiagram(play, currentFormation)
    })
  })

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view))
  })

  document.getElementById('print-btn').addEventListener('click', triggerPrint)
}

init()
