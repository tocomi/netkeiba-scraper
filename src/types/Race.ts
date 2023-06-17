import { Horse } from './Horse';

export type Race = {
  round: number;
  name: string;
  place: string;
  horses: Horse[];
};
