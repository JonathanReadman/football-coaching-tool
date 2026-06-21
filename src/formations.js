// SVG viewBox is "0 0 300 200"
// Columns: left x=0–100, central x=100–200, right x=200–300
// Rows: attacking y=0–67, midfield y=67–133, defensive y=133–200

export const ZONE_RECTS = {
  1: { x: 0,   y: 0,   w: 100, h: 67 },
  2: { x: 100, y: 0,   w: 100, h: 67 },
  3: { x: 200, y: 0,   w: 100, h: 67 },
  4: { x: 0,   y: 67,  w: 100, h: 66 },
  5: { x: 100, y: 67,  w: 100, h: 66 },
  6: { x: 200, y: 67,  w: 100, h: 66 },
  7: { x: 0,   y: 133, w: 100, h: 67 },
  8: { x: 100, y: 133, w: 100, h: 67 },
  9: { x: 200, y: 133, w: 100, h: 67 },
}

export const FORMATIONS = {
  '2-4-2': {
    name: '2-4-2',
    players: [
      { id: 'GK',  label: 'GK',  x: 150, y: 188, primaryZones: [7, 8, 9] },
      { id: 'LB',  label: 'LB',  x: 55,  y: 163, primaryZones: [7, 8] },
      { id: 'RB',  label: 'RB',  x: 245, y: 163, primaryZones: [8, 9] },
      { id: 'LM',  label: 'LM',  x: 25,  y: 100, primaryZones: [4, 1] },
      {
        id: 'CDM',
        label: 'CDM',
        x: 110,
        y: 115,
        primaryZones: [5, 8],
        note: 'Holding midfielder — sits deeper than CM, shields the defensive line',
      },
      { id: 'CM',  label: 'CM',  x: 190, y: 88,  primaryZones: [5, 2] },
      { id: 'RM',  label: 'RM',  x: 275, y: 100, primaryZones: [6, 3] },
      { id: 'LF',  label: 'LF',  x: 65,  y: 28,  primaryZones: [1, 2] },
      { id: 'RF',  label: 'RF',  x: 235, y: 28,  primaryZones: [3, 2] },
    ],
  },
  '3-4-1': {
    name: '3-4-1',
    players: [
      { id: 'GK',  label: 'GK',  x: 150, y: 188, primaryZones: [7, 8, 9] },
      { id: 'LCB', label: 'LCB', x: 65,  y: 158, primaryZones: [7, 8] },
      { id: 'CB',  label: 'CB',  x: 150, y: 163, primaryZones: [8] },
      { id: 'RCB', label: 'RCB', x: 235, y: 158, primaryZones: [8, 9] },
      { id: 'LM',  label: 'LM',  x: 25,  y: 100, primaryZones: [4, 1] },
      { id: 'CM',  label: 'CM',  x: 110, y: 95,  primaryZones: [5, 4, 6] },
      { id: 'CM2', label: 'CM',  x: 190, y: 95,  primaryZones: [5, 4, 6] },
      { id: 'RM',  label: 'RM',  x: 275, y: 100, primaryZones: [6, 3] },
      { id: 'AM',  label: 'ST',  x: 150, y: 33,  primaryZones: [2, 1, 3] },
    ],
  },
}

/** @param {string} key */
export function getFormation(key) {
  return FORMATIONS[key]
}

/** @param {string} key */
export function getPlayersByFormation(key) {
  return FORMATIONS[key]?.players ?? []
}
