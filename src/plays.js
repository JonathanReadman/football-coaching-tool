export const THEMES = [
  'Building from the back',
  'Pressing triggers',
  'Wide combinations',
  'Central overloads',
]

// Helpers — default player positions reused across steps
const D242 = {
  GK:  { x: 150, y: 188 }, LB:  { x: 55,  y: 163 }, RB:  { x: 245, y: 163 },
  LM:  { x: 25,  y: 100 }, CDM: { x: 110, y: 115 }, CM:  { x: 190, y: 88  },
  RM:  { x: 275, y: 100 }, LF:  { x: 65,  y: 28  }, RF:  { x: 235, y: 28  },
}
const D341 = {
  GK:  { x: 150, y: 188 }, LCB: { x: 65,  y: 158 }, CB:  { x: 150, y: 163 },
  RCB: { x: 235, y: 158 }, LM:  { x: 25,  y: 100 }, CM:  { x: 110, y: 95  },
  CM2: { x: 190, y: 95  }, RM:  { x: 275, y: 100 }, AM:  { x: 150, y: 33  },
}

export const PLAYS = [
  {
    id: 'build-back-gk-lb',
    title: 'GK plays short to LB under pressure',
    theme: 'Building from the back',
    formations: ['2-4-2'],
    coachingPoint:
      'Playing short from the GK drags the opposition press higher and creates space in behind them. The CDM always gives the defenders a central option — never leave them with only wide passes.',
    steps: [
      {
        description: 'Opposition press high — GK has the ball.',
        positions: { '2-4-2': { ...D242 } },
      },
      {
        description: 'LB drops into zone 7 and shows for the pass.',
        positions: { '2-4-2': { ...D242, LB: { x: 55, y: 172 } } },
      },
      {
        description: 'GK plays short to LB. LM pushes wide in zone 4 as an outlet.',
        positions: { '2-4-2': { ...D242, LB: { x: 55, y: 163 }, LM: { x: 20, y: 82 } } },
      },
      {
        description: 'LB receives, turns, plays to LM. CDM drops as a safety option.',
        positions: { '2-4-2': { ...D242, LM: { x: 20, y: 72 }, CDM: { x: 130, y: 152 } } },
      },
    ],
  },
  {
    id: 'build-back-cb-switch',
    title: 'CB switches play from left to right (3-4-1)',
    theme: 'Building from the back',
    formations: ['3-4-1'],
    coachingPoint:
      'Switching play quickly exploits the space on the weak side of the press. The CB must be confident on the ball — this is a key technical challenge for defenders at U12.',
    steps: [
      {
        description: 'Opposition press the left side — LCB has the ball.',
        positions: { '3-4-1': { ...D341 } },
      },
      {
        description: 'CB moves centrally to offer a pass option.',
        positions: { '3-4-1': { ...D341, CB: { x: 100, y: 160 } } },
      },
      {
        description: 'CB plays a long switch to RCB who is free. RM pushes up.',
        positions: { '3-4-1': { ...D341, RM: { x: 275, y: 78 } } },
      },
      {
        description: 'RCB plays to RM in zone 6. Team shifts right to support.',
        positions: { '3-4-1': { ...D341, RM: { x: 275, y: 58 }, CM2: { x: 215, y: 90 }, AM: { x: 200, y: 30 } } },
      },
    ],
  },
  {
    id: 'press-trigger-gk',
    title: 'Pressing trigger — GK plays long',
    theme: 'Pressing triggers',
    formations: ['2-4-2', '3-4-1'],
    coachingPoint:
      'A pressing trigger is a visual cue for the whole team to press together. Without a trigger, individual pressing leaves gaps. Agree the trigger in training so every player knows their job.',
    steps: [
      {
        description: 'LF closes down the CB. Signal: LF raises their arm.',
        positions: { '2-4-2': { ...D242 }, '3-4-1': { ...D341 } },
      },
      {
        description: 'On the signal, the whole team steps up 10 yards.',
        positions: {
          '2-4-2': { ...D242,
            GK: { x: 150, y: 170 }, LB: { x: 55, y: 145 }, RB: { x: 245, y: 145 },
            LM: { x: 25, y: 82 }, CDM: { x: 110, y: 97 }, CM: { x: 190, y: 70 },
            RM: { x: 275, y: 82 }, LF: { x: 65, y: 12 }, RF: { x: 235, y: 12 },
          },
          '3-4-1': { ...D341,
            GK: { x: 150, y: 170 }, LCB: { x: 65, y: 140 }, CB: { x: 150, y: 145 },
            RCB: { x: 235, y: 140 }, LM: { x: 25, y: 82 }, CM: { x: 110, y: 77 },
            CM2: { x: 190, y: 77 }, RM: { x: 275, y: 82 }, AM: { x: 150, y: 15 },
          },
        },
      },
      {
        description: 'CB plays long — LB positions to win the header in zone 7.',
        positions: {
          '2-4-2': { ...D242,
            GK: { x: 150, y: 170 }, LB: { x: 55, y: 138 }, RB: { x: 245, y: 145 },
            LM: { x: 25, y: 82 }, CDM: { x: 110, y: 97 }, CM: { x: 190, y: 70 },
            RM: { x: 275, y: 82 }, LF: { x: 65, y: 12 }, RF: { x: 235, y: 12 },
          },
          '3-4-1': { ...D341,
            GK: { x: 150, y: 170 }, LCB: { x: 65, y: 138 }, CB: { x: 150, y: 145 },
            RCB: { x: 235, y: 140 }, LM: { x: 25, y: 82 }, CM: { x: 110, y: 77 },
            CM2: { x: 190, y: 77 }, RM: { x: 275, y: 82 }, AM: { x: 150, y: 15 },
          },
        },
      },
      {
        description: 'CDM covers behind LB — ready to collect the second ball.',
        positions: {
          '2-4-2': { ...D242,
            GK: { x: 150, y: 170 }, LB: { x: 55, y: 138 }, RB: { x: 245, y: 145 },
            LM: { x: 25, y: 82 }, CDM: { x: 95, y: 152 }, CM: { x: 190, y: 70 },
            RM: { x: 275, y: 82 }, LF: { x: 65, y: 12 }, RF: { x: 235, y: 12 },
          },
          '3-4-1': { ...D341,
            GK: { x: 150, y: 170 }, LCB: { x: 65, y: 138 }, CB: { x: 150, y: 145 },
            RCB: { x: 235, y: 140 }, LM: { x: 25, y: 82 }, CM: { x: 95, y: 150 },
            CM2: { x: 190, y: 77 }, RM: { x: 275, y: 82 }, AM: { x: 150, y: 15 },
          },
        },
      },
    ],
  },
  {
    id: 'press-trigger-back-pass',
    title: 'Pressing trigger — back pass to GK',
    theme: 'Pressing triggers',
    formations: ['2-4-2', '3-4-1'],
    coachingPoint:
      'A back pass to the GK is a moment of weakness — the opposition have run out of ideas. Win the ball high here and you are in a great position to score.',
    steps: [
      {
        description: 'Trigger: opposition defender plays back to their GK.',
        positions: { '2-4-2': { ...D242 }, '3-4-1': { ...D341 } },
      },
      {
        description: 'LF/AM sprints to close the GK — angle the run to block the easy pass.',
        positions: {
          '2-4-2': { ...D242, LF: { x: 140, y: 12 } },
          '3-4-1': { ...D341, AM: { x: 140, y: 12 } },
        },
      },
      {
        description: 'LM and CM press the nearest options to cut off easy exits.',
        positions: {
          '2-4-2': { ...D242, LF: { x: 140, y: 12 }, LM: { x: 28, y: 75 }, CDM: { x: 130, y: 95 } },
          '3-4-1': { ...D341, AM: { x: 140, y: 12 }, LM: { x: 28, y: 75 }, CM: { x: 130, y: 72 } },
        },
      },
      {
        description: 'Force the GK to play long or make a mistake. Rest of team holds shape.',
        positions: {
          '2-4-2': { ...D242, LF: { x: 150, y: 10 }, LM: { x: 28, y: 75 }, CDM: { x: 130, y: 95 } },
          '3-4-1': { ...D341, AM: { x: 150, y: 10 }, LM: { x: 28, y: 75 }, CM: { x: 130, y: 72 } },
        },
      },
    ],
  },
  {
    id: 'wide-combo-overlap',
    title: 'Overlapping run — LM overlaps LF',
    theme: 'Wide combinations',
    formations: ['2-4-2'],
    coachingPoint:
      'The overlap creates a 2v1 against the opposing full-back. The key is timing — LM must not run too early. LF must hold the ball long enough for LM to get past.',
    steps: [
      {
        description: 'LF receives the ball in zone 1 with their back to goal.',
        positions: { '2-4-2': { ...D242 } },
      },
      {
        description: 'LM makes an overlapping run down the touchline. LF holds the ball.',
        positions: { '2-4-2': { ...D242, LM: { x: 10, y: 42 } } },
      },
      {
        description: 'LF lays off to the overlapping LM as they go past.',
        positions: { '2-4-2': { ...D242, LM: { x: 10, y: 20 }, LF: { x: 65, y: 38 } } },
      },
      {
        description: 'LM delivers an early cross into zone 2 for the forwards.',
        positions: { '2-4-2': { ...D242, LM: { x: 8, y: 8 }, LF: { x: 65, y: 38 }, RF: { x: 135, y: 18 } } },
      },
    ],
  },
  {
    id: 'central-overload-cdm',
    title: 'CDM drops to create 3v2 in central midfield',
    theme: 'Central overloads',
    formations: ['2-4-2'],
    coachingPoint:
      'The CDM dropping deep creates a 3v2 in the build-up — two defenders and the CDM against the two opposition forwards. This gives the team a numerical advantage to play through the press.',
    steps: [
      {
        description: 'LB has the ball in zone 7.',
        positions: { '2-4-2': { ...D242 } },
      },
      {
        description: 'CDM drops into zone 8 between the two defenders.',
        positions: { '2-4-2': { ...D242, CDM: { x: 130, y: 158 } } },
      },
      {
        description: 'LB plays into CDM. CM makes a run from zone 5 into zone 2.',
        positions: { '2-4-2': { ...D242, CDM: { x: 130, y: 158 }, CM: { x: 190, y: 65 } } },
      },
      {
        description: 'CDM plays through ball to CM arriving in the attacking zone.',
        positions: { '2-4-2': { ...D242, CDM: { x: 130, y: 158 }, CM: { x: 178, y: 38 } } },
      },
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
