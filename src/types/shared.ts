export const raceClassName = {
  NEW: '新馬',
  '0WIN': '未勝利',
  '1WIN': '1勝',
  '2WIN': '2勝',
  '3WIN': '3勝',
  OP: 'OP',
  L: 'L',
  G: 'G',
  G3: 'G3',
  G2: 'G2',
  G1: 'G1',
  OTHER: '-',
} as const;
export type RaceClass = keyof typeof raceClassName;

export const raceTypeName = {
  turf: '芝',
  dirt: 'ダ',
  hurdle: '障',
} as const;
export type RaceType = keyof typeof raceTypeName;
