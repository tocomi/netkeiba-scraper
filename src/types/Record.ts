import { RaceClass } from './shared';

export type Record = {
  date: string;
  place: string;
  name: string;
  class: RaceClass;
  diff: number;
};
