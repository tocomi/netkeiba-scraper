import { RaceType } from '../../types';

export const getRaceTypeFromTypeName = (typeName: string): RaceType => {
  if (typeName === '芝') return 'turf';
  if (typeName === 'ダ') return 'dirt';
  if (typeName === '障') return 'hurdle';
  return 'turf';
};
