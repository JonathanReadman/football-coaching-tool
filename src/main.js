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
    if (!document.getElementById('zone-panel').classList.contains('panel--hidden')) {
      activeZoneId = null
      hideZonePanel()
      renderPitch()
    }
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
