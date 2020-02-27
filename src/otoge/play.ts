import { Sender } from "./commands/send";
import { Watchers } from "./watchers";
import { Music } from "./music";
import { Rank } from "./rank";
import { JudgeInfo } from "./judge-info";
import { Judge } from "./judge";
import WavPlayer from "node-wav-player";

import point from "../../assets/point.json";
import achievement from "../../assets/achievement.json";

export class Play {
  watchers: Watchers;

  scoreLimit: number;

  // ToDo: Asynchronous initialization
  startTime!: number;

  score: number;

  combo: number;

  maxCombo: number;

  judgeCount: { [key in Judge]: number };

  constructor(music: Music, sender: Sender, onEnd: () => void) {
    this.watchers = music.watchers;
    this.scoreLimit = music.scoreLimit;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.judgeCount = {
      perfect: 0,
      great: 0,
      good: 0,
      bad: 0,
      miss: 0
    };
    this.startTime = Date.now() + 5000;
    this.watchers.laneWatchers.forEach(w =>
      w.init(this.startTime, this.judgeResolver(sender))
    );
    setTimeout(
      () => sender.send("/input", { command: "LRFUp" }),
      this.startTime - Date.now()
    );

    new Promise(r =>
      sender.send(
        "/select-music",
        {
          command: "start",
          time: this.startTime
        },
        () => r()
      )
    ).then(() => {
      music.score.notes.map((lane, laneNum) => {
        lane.forEach(note =>
          sender.send("/notes", {
            command: "new",
            id: note.id,
            speed: note.speed,
            lane: laneNum,
            time: note.expires
          })
        );
      });

      music.score.slideNotes.forEach(note => {
        sender.send("/notes", {
          command: "newFoot",
          id: note.id,
          startLane: note.startLane,
          endLane: note.endLane,
          time: note.startExpires,
          length: note.endExpires - note.startExpires,
          speed: note.speed
        });
      });
    });

    setTimeout(() => {
      WavPlayer.play({
        path: music.wavFile,
        sync: false
      }).catch((err: any) => {
        console.log(err);
      });
    }, this.startTime + 5000 - Date.now());

    let endTime = this.startTime + music.score.term + 500;

    setTimeout(() => {
      sender.send("/notes", {
        command: "end",
        perfectCount: this.judgeCount["perfect"],
        greatCount: this.judgeCount["great"],
        goodCount: this.judgeCount["good"],
        badCount: this.judgeCount["bad"] + this.judgeCount["miss"],
        maxCombo: this.maxCombo,
        score: this.score,
        rank: this.calculateRank()
      });

      onEnd();

      sender.send("/input", { command: "LRFDown" });
    }, endTime - Date.now());
  }

  private judgeResolver(sender: Sender) {
    return (j: JudgeInfo) => {
      this.score += point[j.judge];
      this.combo = j.judge == "bad" || j.judge == "miss" ? 0 : this.combo + 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.judgeCount[j.judge] += 1;

      sender.send("/notes", {
        command: "judge",
        judge: j.judge,
        id: j.noteId,
        delete: j.delete,
        combo: this.combo,
        comboMax: this.maxCombo,
        score: this.score
      });
    };
  }

  judge(lane: number, time: number, sender: Sender) {
    this.watchers.laneWatchers[lane].judge(
      time - this.startTime,
      this.judgeResolver(sender)
    );
  }

  judgeSlide(lanes: [number, number], time: number, sender: Sender) {
    this.watchers.slideWatchers.forEach(w => {
      let judgeInfo = lanes.reduce((acc, lane) => {
        let j = w.judge(time - this.startTime, lane);
        if (acc) {
          return acc == "perfect" ? acc : j || acc;
        } else {
          return j;
        }
      }, null);

      if (judgeInfo) {
        this.score += judgeInfo.judge == "bad" ? 0 : judgeInfo.point;
        // ToDo: Should this is incremented only the end of the slide?
        this.combo += judgeInfo.judge == "bad" ? 0 : 1;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        this.judgeCount[judgeInfo.judge] += 1;

        sender.send("/notes", {
          command: "judge",
          judge: judgeInfo.judge,
          id: judgeInfo.noteId,
          delete: judgeInfo.delete,
          combo: this.combo,
          comboMax: this.maxCombo,
          score: this.score,
          position: judgeInfo.lane
        });
      }
    });
  }

  private calculateRank(): Rank {
    let ratio = this.score / this.scoreLimit;
    return ratio >= achievement.SSS / 100
      ? "SSS"
      : ratio >= achievement.SS / 100
      ? "SS"
      : ratio >= achievement.S / 100
      ? "S"
      : ratio >= achievement.A / 100
      ? "A"
      : "B";
  }
}
