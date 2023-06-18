import { Horse } from './Horse';
import { RaceClass } from './shared';

export type Race = {
  round: number;
  name: string;
  class: RaceClass;
  place: string;
  horses: Horse[];
};

export type RaceSummary = Omit<Race, 'horses'> & {
  /** netkeiba 上で定義されている ID */
  id: number;
  // class: string;
  // startTime: string;
  // groundType: string;
  // distance: number;
  // horseCount: number;
};
