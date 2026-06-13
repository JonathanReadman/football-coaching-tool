export const THEMES = [
  'Building from the back',
  'Pressing triggers',
  'Wide combinations',
  'Central overloads',
]

export const PLAYS = [
  {
    id: 'build-back-gk-lb',
    title: 'GK plays short to LB under pressure',
    theme: 'Building from the back',
    formations: ['2-4-2'],
    steps: [
      'Opposition press high — GK has the ball.',
      'LB drops into zone 7 and shows for the pass.',
      'GK plays short to LB. LM pushes wide in zone 4 as an outlet.',
      'LB receives, turns, and plays to LM in zone 4.',
      'CDM drops into zone 8 as a safety option if LM is closed down.',
    ],
    coachingPoint:
      'Playing short from the GK drags the opposition press higher and creates space in behind them. The CDM always gives the defenders a central option — never leave them with only wide passes.',
    playerOverrides: {},
    arrows: [
      { from: { x: 150, y: 188 }, to: { x: 55, y: 163 }, type: 'pass' },
      { from: { x: 25, y: 100 },  to: { x: 25, y: 80 },  type: 'run' },
      { from: { x: 55, y: 163 },  to: { x: 25, y: 80 },  type: 'pass' },
      { from: { x: 110, y: 115 }, to: { x: 130, y: 150 }, type: 'run' },
    ],
  },
  {
    id: 'build-back-cb-switch',
    title: 'CB switches play from left to right (3-4-1)',
    theme: 'Building from the back',
    formations: ['3-4-1'],
    steps: [
      'Opposition press the left side — LCB has the ball.',
      'CB moves to receive from LCB.',
      'CB plays a long switch to RCB who is free.',
      'RM pushes up into zone 6 to receive from RCB.',
      'Team shifts right to support the attack.',
    ],
    coachingPoint:
      'Switching play quickly exploits the space on the weak side of the press. The CB must be confident on the ball — this is a key technical challenge for defenders at U12.',
    playerOverrides: {},
    arrows: [
      { from: { x: 65, y: 158 },  to: { x: 150, y: 163 }, type: 'pass' },
      { from: { x: 150, y: 163 }, to: { x: 235, y: 158 }, type: 'pass' },
      { from: { x: 275, y: 100 }, to: { x: 275, y: 75 },  type: 'run' },
      { from: { x: 235, y: 158 }, to: { x: 275, y: 75 },  type: 'pass' },
    ],
  },
  {
    id: 'press-trigger-gk',
    title: 'Pressing trigger — GK plays long',
    theme: 'Pressing triggers',
    formations: ['2-4-2', '3-4-1'],
    steps: [
      'LF closes down the CB. Signal: LF raises their arm.',
      'On the signal, the whole team steps up 10 yards.',
      'If the CB plays long, LB wins the header in zone 7.',
      'CDM covers behind LB — ready to collect the second ball.',
      'Team transitions to attack immediately on winning possession.',
    ],
    coachingPoint:
      'A pressing trigger is a visual cue for the whole team to press together. Without a trigger, individual pressing leaves gaps. Agree the trigger in training so every player knows their job.',
    playerOverrides: {},
    arrows: [
      { from: { x: 65, y: 28 },   to: { x: 65, y: 158 },  type: 'run' },
      { from: { x: 110, y: 115 }, to: { x: 80, y: 148 },   type: 'run' },
    ],
  },
  {
    id: 'press-trigger-back-pass',
    title: 'Pressing trigger — back pass to GK',
    theme: 'Pressing triggers',
    formations: ['2-4-2', '3-4-1'],
    steps: [
      'Trigger: opposition defender plays back to their GK.',
      'LF sprints to close the GK — angle the run to block the easy pass.',
      'LM and CM press the nearest options to cut off easy exits.',
      'Rest of the team holds shape — do not all press.',
      'Force the GK to play long or make a mistake.',
    ],
    coachingPoint:
      'A back pass to the GK is a moment of weakness — the opposition have run out of ideas. Win the ball high here and you are in a great position to score.',
    playerOverrides: {},
    arrows: [
      { from: { x: 65, y: 28 },  to: { x: 150, y: 188 }, type: 'run' },
      { from: { x: 25, y: 100 }, to: { x: 55, y: 163 },  type: 'run' },
      { from: { x: 190, y: 88 }, to: { x: 150, y: 163 }, type: 'run' },
    ],
  },
  {
    id: 'wide-combo-overlap',
    title: 'Overlapping run — LM overlaps LF',
    theme: 'Wide combinations',
    formations: ['2-4-2'],
    steps: [
      'LF receives the ball in zone 1 with their back to goal.',
      'LM makes an overlapping run down the touchline.',
      'LF holds the ball, waits for LM to go past.',
      'LF lays off to the overlapping LM.',
      'LM delivers an early cross into zone 2 for the forwards.',
    ],
    coachingPoint:
      'The overlap creates a 2v1 against the opposing full-back. The key is timing — LM must not run too early. LF must hold the ball long enough for LM to get past.',
    playerOverrides: {},
    arrows: [
      { from: { x: 25, y: 100 }, to: { x: 15, y: 30 },  type: 'run' },
      { from: { x: 65, y: 28 },  to: { x: 15, y: 30 },  type: 'pass' },
      { from: { x: 15, y: 30 },  to: { x: 130, y: 20 }, type: 'pass' },
    ],
  },
  {
    id: 'central-overload-cdm',
    title: 'CDM drops to create 3v2 in central midfield',
    theme: 'Central overloads',
    formations: ['2-4-2'],
    steps: [
      'LB has the ball in zone 7.',
      'CDM drops into zone 8 between the two defenders.',
      'LB plays into CDM. CDM has two options: CM or RB.',
      'CM makes a run from zone 5 into zone 2 to receive.',
      'CDM plays through ball to CM arriving in the attacking zone.',
    ],
    coachingPoint:
      'The CDM dropping deep creates a 3v2 in the build-up — two defenders and the CDM against the two opposition forwards. This gives the team a numerical advantage to play through the press.',
    playerOverrides: {},
    arrows: [
      { from: { x: 55, y: 163 },  to: { x: 130, y: 155 }, type: 'pass' },
      { from: { x: 110, y: 115 }, to: { x: 130, y: 155 }, type: 'run' },
      { from: { x: 190, y: 88 },  to: { x: 180, y: 40 },  type: 'run' },
      { from: { x: 130, y: 155 }, to: { x: 180, y: 40 },  type: 'pass' },
    ],
  },
]

/** @param {string} id */
export function getPlay(id) {
  return PLAYS.find(p => p.id === id)
}

/** @param {string} theme */
export function getPlaysByTheme(theme) {
  return PLAYS.filter(p => p.theme === theme)
}
