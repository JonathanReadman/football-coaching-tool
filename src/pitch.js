import { ZONE_RECTS, getPlayersByFormation } from './formations.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

/** @param {string} tag @param {Record<string,string>} attrs */
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  return el
}

/**
 * @param {string} formation - '2-4-2' or '3-4-1'
 * @param {number|null} activeZoneId
 * @param {(zoneId: number) => void} onZoneClick
 * @returns {SVGElement}
 */
export function createPitchSVG(formation, activeZoneId, onZoneClick) {
  const svg = svgEl('svg', {
    viewBox: '0 0 300 200',
    role: 'img',
    'aria-label': 'Football pitch with 9 zones',
  })

  // Pitch background
  svg.appendChild(svgEl('rect', { x: '0', y: '0', width: '300', height: '200', class: 'pitch__bg' }))

  // Centre line
  svg.appendChild(svgEl('line', { x1: '0', y1: '100', x2: '300', y2: '100', class: 'pitch__line' }))

  // Centre circle
  svg.appendChild(svgEl('circle', { cx: '150', cy: '100', r: '25', class: 'pitch__circle' }))

  // Zone rectangles
  for (const [idStr, rect] of Object.entries(ZONE_RECTS)) {
    const id = Number(idStr)
    const r = svgEl('rect', {
      x: String(rect.x),
      y: String(rect.y),
      width: String(rect.w),
      height: String(rect.h),
      'data-zone': String(id),
      class: `pitch__zone${id === activeZoneId ? ' zone--active' : ''}`,
    })
    r.addEventListener('click', () => onZoneClick(id))
    svg.appendChild(r)
  }

  // Player tokens
  const players = getPlayersByFormation(formation)
  for (const player of players) {
    const g = svgEl('g', { 'data-player': player.id })
    g.appendChild(svgEl('circle', {
      cx: String(player.x),
      cy: String(player.y),
      r: '8',
      class: 'pitch__player',
    }))
    const label = svgEl('text', {
      x: String(player.x),
      y: String(player.y + 4),
      'text-anchor': 'middle',
      class: 'pitch__player-label',
    })
    label.textContent = player.label
    g.appendChild(label)
    svg.appendChild(g)
  }

  return svg
}
