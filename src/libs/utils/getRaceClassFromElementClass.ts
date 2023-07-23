import { RaceClass } from '@/types';

export const getRaceClassFromElementClass = (
  className: string
): RaceClass | undefined => {
  if (className === 'Icon_GradeType1') return 'G1';
  if (className === 'Icon_GradeType2') return 'G2';
  if (className === 'Icon_GradeType3') return 'G3';
  if (className === 'Icon_GradeType4') return 'G';
  if (className === 'Icon_GradeType5') return 'OP';
  if (className === 'Icon_GradeType15') return 'L';
  if (className === 'Icon_GradeType16') return '3WIN';
  if (className === 'Icon_GradeType17') return '2WIN';
  if (className === 'Icon_GradeType18') return '1WIN';
  return undefined;
};
