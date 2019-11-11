import { Score } from './score';
import { Watchers } from './watchers';


export interface Music {
  wavFile: string;
  scoreLimit: number
  score: Score;
  watchers: Watchers;
}
