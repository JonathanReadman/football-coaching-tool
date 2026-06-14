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

  // Arrowhead marker for movement arrows
  const defs = svgEl('defs', {})
  const marker = svgEl('marker', {
    id: 'movement-arrowhead',
    markerWidth: '6',
    markerHeight: '4',
    refX: '5',
    refY: '2',
    orient: 'auto',
  })
  const arrowPolygon = svgEl('polygon', { points: '0 0, 6 2, 0 4', class: 'movement-arrowhead' })
  marker.appendChild(arrowPolygon)
  defs.appendChild(marker)
  svg.appendChild(defs)

  // Pitch background
  svg.appendChild(svgEl('rect', { x: '0', y: '0', width: '300', height: '200', class: 'pitch__bg' }))

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
    r.addEventListener('click', (e) => { e.stopPropagation(); onZoneClick(id) })
    svg.appendChild(r)
  }

  // Player tokens
  const players = getPlayersByFormation(formation)
  for (const player of players) {
    const g = svgEl('g', {
      'data-player': player.id,
      transform: `translate(${player.x},${player.y})`,
    })
    g.appendChild(svgEl('circle', {
      cx: '0', cy: '0', r: '8', class: 'pitch__player',
    }))
    const label = svgEl('text', {
      x: '0', y: '4', 'text-anchor': 'middle', class: 'pitch__player-label',
    })
    label.textContent = player.label
    g.appendChild(label)
    svg.appendChild(g)
  }

  return svg
}

/**
 * Move player tokens to new positions. Each entry in positions maps a player id
 * to an {x, y} coordinate. Players not listed are left unchanged.
 * @param {SVGElement} svg
 * @param {Record<string, {x: number, y: number}>} positions
 */
export function updatePlayerPositions(svg, positions) {
  for (const [id, pos] of Object.entries(positions)) {
    const g = svg.querySelector(`[data-player="${id}"]`)
    if (g) g.setAttribute('transform', `translate(${pos.x},${pos.y})`)
  }
}

/**
 * Draw movement arrows from fromPositions to toPositions. Clears any existing
 * arrows first. Pass null for fromPositions to just clear.
 * @param {SVGElement} svg
 * @param {Record<string, {x: number, y: number}> | null} fromPositions
 * @param {Record<string, {x: number, y: number}>} toPositions
 */
export function drawMovementArrows(svg, fromPositions, toPositions) {
  const existing = svg.querySelector('.movement-arrows')
  if (existing) existing.remove()
  if (!fromPositions) return

  const g = svgEl('g', { class: 'movement-arrows' })
  const R = 10 // offset from player centre (radius 8 + gap)

  for (const [id, to] of Object.entries(toPositions)) {
    const from = fromPositions[id]
    if (!from) continue
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 6) continue // didn't move meaningfully

    const ux = dx / dist
    const uy = dy / dist
    const line = svgEl('line', {
      x1: String(from.x + ux * R),
      y1: String(from.y + uy * R),
      x2: String(to.x - ux * R),
      y2: String(to.y - uy * R),
      class: 'movement-arrow',
      'marker-end': 'url(#movement-arrowhead)',
    })
    g.appendChild(line)
  }

  // Insert before player tokens so arrows render beneath them
  const firstPlayer = svg.querySelector('[data-player]')
  if (firstPlayer) {
    svg.insertBefore(g, firstPlayer)
  } else {
    svg.appendChild(g)
  }
}
