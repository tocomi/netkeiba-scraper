import { HorseSex } from '@/types';

export const getHorseSexFromText = (sexText: string): HorseSex => {
  if (sexText === '牡') return 'male';
  if (sexText === '牝') return 'female';
  return 'other';
};
