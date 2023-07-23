import { Record } from './Record';

export const HorseSexMap = {
  male: '牡',
  female: '牝',
  other: 'セ',
};
export type HorseSex = keyof typeof HorseSexMap;

export type Horse = {
  name: string;
  url: string;
  horseNumber: number;
  gateNumber: number;
  odds: number;
  oddsRank: number;
  sex: HorseSex;
  age: number;
  jockey: string;
  handi: number;
  records: Record[];
};
