import { createPitchSVG } from './pitch.js'

/**
 * @param {import('./zones.js').Zone} zone
 * @param {string} formation
 */
// eslint-disable-next-line no-unused-vars
export function showZonePanel(zone, formation) {
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
 * @param {import('./plays.js').Play[]} plays
 * @param {string[]} themes
 * @param {string} formation
 * @param {(playId: string) => void} onSelect
 */
export function renderPlaysLibrary(plays, themes, formation, onSelect) {
  const container = document.getElementById('plays-list')
  container.innerHTML = ''

  for (const theme of themes) {
    const themePlays = plays.filter(
      p => p.theme === theme && (p.formations.includes(formation) || p.formations.includes('both'))
    )
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
      btn.addEventListener('click', () => onSelect(play.id))
      section.appendChild(btn)
    }

    container.appendChild(section)
  }
}

/**
 * @param {import('./plays.js').Play} play
 * @param {string} formation
 */
export function showPlayDiagram(play, formation) {
  const detail = document.getElementById('play-detail')
  detail.innerHTML = ''

  const title = document.createElement('h2')
  title.textContent = play.title
  detail.appendChild(title)

  const diagram = document.getElementById('play-diagram')
  diagram.innerHTML = ''
  const svg = createPitchSVG(formation, null, () => {})
  _renderArrows(svg, play.arrows)
  diagram.appendChild(svg)

  const stepsList = document.createElement('ol')
  stepsList.className = 'play-steps'
  for (const step of play.steps) {
    const li = document.createElement('li')
    li.textContent = step
    stepsList.appendChild(li)
  }
  detail.appendChild(stepsList)

  const point = document.createElement('p')
  point.className = 'play-coaching-point'
  point.textContent = play.coachingPoint
  detail.appendChild(point)
}

/** @param {SVGElement} svg @param {Array} arrows */
function _renderArrows(svg, arrows) {
  const SVG_NS = 'http://www.w3.org/2000/svg'

  const defs = document.createElementNS(SVG_NS, 'defs')
  for (const type of ['ball', 'pass', 'run']) {
    const marker = document.createElementNS(SVG_NS, 'marker')
    marker.setAttribute('id', `arrow-${type}`)
    marker.setAttribute('markerWidth', '6')
    marker.setAttribute('markerHeight', '6')
    marker.setAttribute('refX', '5')
    marker.setAttribute('refY', '3')
    marker.setAttribute('orient', 'auto')
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', 'M0,0 L0,6 L6,3 z')
    path.setAttribute('class', `arrow-head arrow-head--${type}`)
    marker.appendChild(path)
    defs.appendChild(marker)
  }
  svg.appendChild(defs)

  for (const arrow of arrows) {
    const line = document.createElementNS(SVG_NS, 'line')
    line.setAttribute('x1', String(arrow.from.x))
    line.setAttribute('y1', String(arrow.from.y))
    line.setAttribute('x2', String(arrow.to.x))
    line.setAttribute('y2', String(arrow.to.y))
    line.setAttribute('class', `pitch__arrow pitch__arrow--${arrow.type}`)
    line.setAttribute('marker-end', `url(#arrow-${arrow.type})`)
    svg.appendChild(line)
  }
}
