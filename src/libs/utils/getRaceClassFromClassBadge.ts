import { RaceClass } from '@/types';

export const getRaceClassFromClassBadge = (classBadge: string): RaceClass => {
  if (classBadge === 'GI') return 'G1';
  if (classBadge === 'GII') return 'G2';
  if (classBadge === 'GIII') return 'G3';
  if (classBadge === 'OP') return 'OP';
  if (classBadge === 'L') return 'L';
  if (classBadge === '重賞') return 'G';
  if (classBadge === '3勝') return '3WIN';
  if (classBadge === '2勝') return '2WIN';
  if (classBadge === '1勝') return '1WIN';
  if (classBadge === '新馬') return 'NEW';
  if (classBadge === '未勝利') return '0WIN';
  return 'OTHER';
};
