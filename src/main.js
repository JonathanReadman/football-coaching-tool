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

// ── Matchday ──
let matchdayZoneId = null
let matchdayPhase = 'possession'
let matchdaySvg = null

function renderMatchdayPitch() {
  const container = document.getElementById('matchday-pitch')
  container.innerHTML = ''
  matchdaySvg = createPitchSVG(currentFormation, null, onMatchdayZoneClick)
  container.appendChild(matchdaySvg)
  if (matchdayZoneId !== null) applyMatchdayHighlight(matchdayZoneId)
}

function applyMatchdayHighlight(zoneId) {
  if (!matchdaySvg) return
  matchdaySvg.querySelectorAll('.pitch__zone').forEach(el => el.classList.remove('zone--matchday-active'))
  const target = matchdaySvg.querySelector(`[data-zone="${zoneId}"]`)
  if (target) target.classList.add('zone--matchday-active')
}

function updateMatchdayInfo() {
  const info = document.getElementById('matchday-info')
  const prompt = info.querySelector('.matchday-prompt')
  const content = info.querySelector('.matchday-zone-content')

  if (matchdayZoneId === null) {
    info.classList.add('matchday-info--empty')
    prompt.hidden = false
    content.hidden = true
    return
  }

  const zone = getZone(matchdayZoneId)
  info.classList.remove('matchday-info--empty')
  prompt.hidden = true
  content.hidden = false

  document.getElementById('matchday-zone-name').textContent = zone.name
  document.getElementById('matchday-cue').textContent =
    matchdayPhase === 'possession' ? zone.inPossession : zone.outOfPossession

  document.getElementById('matchday-btn-possession')
    .classList.toggle('matchday-phase-btn--active', matchdayPhase === 'possession')
  document.getElementById('matchday-btn-defence')
    .classList.toggle('matchday-phase-btn--active', matchdayPhase === 'defence')
}

function onMatchdayZoneClick(zoneId) {
  matchdayZoneId = matchdayZoneId === zoneId ? null : zoneId
  if (matchdayZoneId !== null) {
    applyMatchdayHighlight(matchdayZoneId)
  } else {
    matchdaySvg?.querySelectorAll('.pitch__zone').forEach(el => el.classList.remove('zone--matchday-active'))
  }
  updateMatchdayInfo()
}

function initMatchday() {
  renderMatchdayPitch()
  document.getElementById('matchday-btn-possession').addEventListener('click', () => {
    matchdayPhase = 'possession'
    updateMatchdayInfo()
  })
  document.getElementById('matchday-btn-defence').addEventListener('click', () => {
    matchdayPhase = 'defence'
    updateMatchdayInfo()
  })
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
  initMatchday()

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
    matchdayZoneId = null
    hideZonePanel()
    renderPitch()
    renderMatchdayPitch()
    updateMatchdayInfo()

    const playView = document.getElementById('play-view')
    const playsList = document.getElementById('plays-list')
    if (!playView.classList.contains('play-view--hidden')) {
      playView.classList.add('play-view--hidden')
      playsList.classList.remove('hidden')
    }

    refreshPlaysView()
  })

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.view) switchView(btn.dataset.view)
    })
  })
}

init()
