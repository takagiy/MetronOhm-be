import * as Path from "path";
import { readFileSync } from "fs";
import { JudgeInfo } from "./judge-info";
import { Judge } from "./judge";
import { Note } from "./note";
import { Sensitivity } from "./sensitivity";

export class LaneWatcher {
  lane: Note[];

  head!: number;

  sensitivity!: Sensitivity;

  missing!: NodeJS.Timeout | null;

  startTime: number;

  sentId!: { [key: number]: boolean };

  constructor(lane: Note[]) {
    this.startTime = 0;
    this.lane = lane;
    this.initProps();
  }

  initProps() {
    this.sentId = {};
    this.missing = null;
    this.head = 0;
    this.sensitivity = JSON.parse(
      readFileSync(Path.resolve("./dist/assets/sensitivity.json"), "utf8")
    );
  }

  init(startTime: number, callbackfn: (j: JudgeInfo) => void) {
    this.startTime = startTime;
    this.initProps();
    this.scheduleMissing(0, callbackfn);
  }

  private scheduleMissing(noteIdx: number, callbackfn: (j: JudgeInfo) => void) {
    let note = this.lane[noteIdx];
    if (note == null) {
      return;
    }

    this.missing = setTimeout(() => {
      this.scheduleMissing(noteIdx + 1, callbackfn);
      this.sentId[note.id] ||
        callbackfn({
          judge: "miss",
          delete: true,
          noteId: note.id
        });
      this.sentId[note.id] = true;
    }, this.startTime + note.expires + this.sensitivity.bad + 50 - Date.now());
  }

  private clearMissing() {
    this.missing && clearTimeout(this.missing);
  }

  judge(relNow: number, callbackfn: (j: JudgeInfo) => void) {
    if (this.lane[this.head] == null) {
      return null;
    }

    this.clearMissing();

    let d = Math.abs(this.lane[this.head].expires - relNow);

    let d_;

    while (
      this.lane[this.head + 1] &&
      (d_ = Math.abs(this.lane[this.head + 1].expires - relNow)) <
        Math.abs(this.lane[this.head].expires - relNow)
    ) {
      callbackfn({
        judge: "miss",
        noteId: this.lane[this.head].id,
        delete: false
      });
      ++this.head;
      d = d_;
    }

    let judge: Judge | null =
      d <= this.sensitivity.perfect
        ? "perfect"
        : d <= this.sensitivity.great
        ? "great"
        : d <= this.sensitivity.good
        ? "good"
        : d <= this.sensitivity.bad
        ? "bad"
        : null;

    this.scheduleMissing(this.head + 1, callbackfn);

    if (judge) {
      this.sentId[this.lane[this.head].id] ||
        callbackfn({
          judge: judge,
          noteId: this.lane[this.head].id,
          delete: true
        });
      this.sentId[this.lane[this.head].id] = true;
      ++this.head;
    }
  }
}
