import { RaceClass } from '@/types';

/**
 * レースの名前からクラスが分かる場合はクラスを返す
 */
export const getRaceClassFromRaceName = (
  raceName: string
): RaceClass | undefined => {
  if (raceName.includes('未勝利')) return '0WIN';
  if (raceName.includes('新馬')) return 'NEW';
  if (raceName.includes('1勝')) return '1WIN';
  if (raceName.includes('2勝')) return '2WIN';
  if (raceName.includes('3勝')) return '3WIN';
  return undefined;
};
