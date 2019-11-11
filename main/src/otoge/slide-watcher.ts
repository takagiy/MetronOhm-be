import { SlideCheckpoint } from './slide-checkpoint';
import { SlideJudgeInfo } from './slide-judge-info';
import { Judge } from './judge';

import slide from '../../assets/slide.json';

export class SlideWatcher {
  checkpoints: SlideCheckpoint[];

  sensitivity: number = slide.sensitivity;

  head!: number;

  constructor(checkpoints: SlideCheckpoint[]) {
    this.checkpoints = checkpoints;
    this.init();
  }

  init() {
    this.head = 0;
  }

  judge(relNow: number, lane: number): SlideJudgeInfo | null {
    if(this.checkpoints[this.head] == null || relNow < this.checkpoints[this.head].expires) {
      return null;
    }
    let judge =
      this.checkpoints[this.head].lane <= lane && lane <= this.checkpoints[this.head].lane + this.sensitivity
        ? 'perfect' : 'bad' as Judge;
    let result = {
      lane: this.checkpoints[this.head].lane - 1.5,
      judge: judge,
      noteId: this.checkpoints[this.head].noteId,
      delete: false,
      point: this.checkpoints[this.head].point
    };
    ++this.head;
    return result;
  }
}
