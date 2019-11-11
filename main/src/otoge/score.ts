import { Note } from './note';
import { SlideNote } from './slide-note';


export interface Score {
  version: number;
  term: number;
  notes: [Note[], Note[], Note[], Note[]];
  slideNotes: SlideNote[];
}
