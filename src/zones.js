export const ZONES = [
  {
    id: 1,
    name: 'Left Attacking Channel',
    third: 'attacking',
    channel: 'left',
    positions: {
      '2-4-2': ['LF', 'LM'],
      '3-4-1': ['LM', 'AM'],
    },
    inPossession:
      'Make runs in behind the defence to stretch the back line. Receive on the last line and look to cut inside or cross early. Your width pins their full-back and opens central space.',
    outOfPossession:
      'Press the opposing right-back immediately on losing the ball. Force play backwards or inside. Track back quickly to support your LM and keep the team compact.',
    coachingPrinciple:
      '"Width in possession forces the defence to stretch. The wide player pins the full-back and opens gaps for runners through the middle." — Positional Play (Guardiola/Cruyff)',
  },
  {
    id: 2,
    name: 'Central Attacking Zone',
    third: 'attacking',
    channel: 'central',
    positions: {
      '2-4-2': ['LF', 'RF'],
      '3-4-1': ['AM'],
    },
    inPossession:
      'Time your run to arrive at the cross or through ball — do not stand still. Hold up play if receiving with your back to goal and link with the CM arriving late. First touch forward.',
    outOfPossession:
      'You are the first line of press. Trigger the team press by closing the centre-back or GK. Force play wide or backwards — never let them play through you easily.',
    coachingPrinciple:
      '"The striker\'s movement creates space. A run in behind drags defenders deep and opens pockets for attacking midfielders arriving late." — FA Coaching Principles (U12)',
  },
  {
    id: 3,
    name: 'Right Attacking Channel',
    third: 'attacking',
    channel: 'right',
    positions: {
      '2-4-2': ['RF', 'RM'],
      '3-4-1': ['RM', 'AM'],
    },
    inPossession:
      'Make runs in behind the defence to stretch the back line. Receive on the last line and look to cut inside or cross early. Your width pins their full-back and opens central space.',
    outOfPossession:
      'Press the opposing left-back immediately on losing the ball. Force play backwards or inside. Track back quickly to support your RM and keep the team compact.',
    coachingPrinciple:
      '"Width in possession forces the defence to stretch. The wide player pins the full-back and opens gaps for runners through the middle." — Positional Play (Guardiola/Cruyff)',
  },
  {
    id: 4,
    name: 'Left Midfield Channel',
    third: 'midfield',
    channel: 'left',
    positions: {
      '2-4-2': ['LM'],
      '3-4-1': ['LM'],
    },
    inPossession:
      'Provide a wide outlet for the defenders and CDM. Overlap with the LF or cut inside to create overloads. Keep the pitch wide — do not drift central when the ball is on your side.',
    outOfPossession:
      'Press the opposing right-back or right midfielder aggressively. Force play backwards. When the ball is on the far side, stay compact centrally — do not chase the ball across the pitch.',
    coachingPrinciple:
      '"Wide midfielders provide the width that stretches defences. Their defensive work starts the instant possession is lost — press immediately, recover shape quickly." — FA 4-Corner Model',
  },
  {
    id: 5,
    name: 'Central Midfield Zone',
    third: 'midfield',
    channel: 'central',
    positions: {
      '2-4-2': ['CDM', 'CM'],
      '3-4-1': ['CM', 'CM2'],
    },
    inPossession:
      'CDM: be available short from defenders at all times — play simple, keep possession, play sideways if under pressure. Do not go forward without covering cover behind you. CM: look to break lines with a through ball or dribble, arrive late into the attacking zone.',
    outOfPossession:
      'CDM: hold your position between the defensive and midfield lines — protect the space in behind the midfield. Do not press high. CM: press with the forwards to win the ball high up the pitch.',
    coachingPrinciple:
      '"The holding midfielder gives the defenders someone to always play to. Be available, be simple. The advanced midfielder breaks lines and scores." — Johan Cruyff on midfield duos',
  },
  {
    id: 6,
    name: 'Right Midfield Channel',
    third: 'midfield',
    channel: 'right',
    positions: {
      '2-4-2': ['RM'],
      '3-4-1': ['RM'],
    },
    inPossession:
      'Provide a wide outlet for the defenders and CDM. Overlap with the RF or cut inside to create overloads. Keep the pitch wide — do not drift central when the ball is on your side.',
    outOfPossession:
      'Press the opposing left-back or left midfielder aggressively. Force play backwards. When the ball is on the far side, stay compact centrally — do not chase the ball across the pitch.',
    coachingPrinciple:
      '"Wide midfielders provide the width that stretches defences. Their defensive work starts the instant possession is lost — press immediately, recover shape quickly." — FA 4-Corner Model',
  },
  {
    id: 7,
    name: 'Left Defensive Channel',
    third: 'defensive',
    channel: 'left',
    positions: {
      '2-4-2': ['LB'],
      '3-4-1': ['LCB'],
    },
    inPossession:
      'LB: push forward when the team has secure possession — provide an overlapping run to create a 2v1 with the LM. Always be an option for the GK under pressure. LCB (3-4-1): step out to press the wide forward; the CB covers centrally.',
    outOfPossession:
      'Protect your channel. Do not be dragged wide by their winger — make them come to you. Stay goal-side and body-side. When the ball is on the far side, tuck in to make the team compact — do not stay wide.',
    coachingPrinciple:
      '"Defenders own their channel. Your first job is to protect the space in behind you — then and only then can you think about supporting the attack." — FA Grassroots Coaching',
  },
  {
    id: 8,
    name: 'Central Defensive Zone',
    third: 'defensive',
    channel: 'central',
    positions: {
      '2-4-2': ['LB', 'RB', 'CDM'],
      '3-4-1': ['CB'],
    },
    inPossession:
      'GK: play short to a defender when under pressure — do not kick long unless necessary. CB (3-4-1) / CDM covering: be the reliable short option. Receive, turn, and play forward if possible, or recycle sideways.',
    outOfPossession:
      'The most dangerous area on the pitch — protect it above all else. Deny through balls down the middle. When the ball is wide, compress centrally and do not follow it — let the wide defenders deal with the wide threat.',
    coachingPrinciple:
      '"The central defensive zone is where games are won and lost. Concede space here and the opposition score easy goals. Defend it with numbers, defend it as a unit." — FA Defending Principles',
  },
  {
    id: 9,
    name: 'Right Defensive Channel',
    third: 'defensive',
    channel: 'right',
    positions: {
      '2-4-2': ['RB'],
      '3-4-1': ['RCB'],
    },
    inPossession:
      'RB: push forward when the team has secure possession — provide an overlapping run to create a 2v1 with the RM. Always be an option for the GK under pressure. RCB (3-4-1): step out to press the wide forward; the CB covers centrally.',
    outOfPossession:
      'Protect your channel. Do not be dragged wide by their winger — make them come to you. Stay goal-side and body-side. When the ball is on the far side, tuck in to make the team compact — do not stay wide.',
    coachingPrinciple:
      '"Defenders own their channel. Your first job is to protect the space in behind you — then and only then can you think about supporting the attack." — FA Grassroots Coaching',
  },
]

/** @param {number} id */
export function getZone(id) {
  return ZONES.find(z => z.id === id)
}

/**
 * @param {string} position - e.g. 'CDM', 'LM'
 * @param {string} formation - '2-4-2' or '3-4-1'
 */
export function getZonesForPosition(position, formation) {
  return ZONES.filter(z => z.positions[formation]?.includes(position))
}
