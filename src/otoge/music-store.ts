import { readdirSync, readFileSync } from "fs";
import * as Path from "path";

import { Score } from "./score";
import { LaneWatcher } from "./lane-watcher";
import { Music } from "./music";
import point from "../../assets/point.json";
import { SlideCheckpoint } from "./slide-checkpoint";
import { SlideNote } from "./slide-note";
import { SlideWatcher } from "./slide-watcher";
import { Difficulty } from "./difficulty";

import slide from "../../assets/slide.json";

interface ScoreMap {
  [key: string]: Music;
}

export class MusicStore {
  musics: {
    plain: { [key in Difficulty]: ScoreMap };
    foot: { [key in Difficulty]: ScoreMap };
  };

  constructor(path: string) {
    this.musics = {
      foot: {
        easy: {},
        normal: {},
        hard: {}
      },
      plain: {
        easy: {},
        normal: {},
        hard: {}
      }
    };

    this.storeScores(path, "plain");

    this.storeScores(path, "foot");
  }

  private storeScores(base: string, suffix: "plain" | "foot") {
    let path = Path.join(base, suffix == "foot" ? "old" : "");
    let dir = readdirSync(path, { withFileTypes: true });

    dir.forEach(d => {
      if (d.isFile() && Path.extname(d.name).toUpperCase() == ".JSON") {
        let data = readFileSync(Path.join(path, d.name), "utf-8");
        let score: Score = JSON.parse(data);

        let laneWatchers = score.notes.map(lane => new LaneWatcher(lane)) as [
          LaneWatcher,
          LaneWatcher,
          LaneWatcher,
          LaneWatcher
        ];

        let maxNormalScore = score.notes
          .map(lane => lane.length * point.perfect)
          .reduce((acc, val) => acc + val);

        let slideCheckpoints = this.loadSlideCheckpoints(score.slideNotes);

        let maxSlideScore = slideCheckpoints
          .map(checkpoints =>
            checkpoints.reduce((acc, cp) => acc + cp.point, 0)
          )
          .reduce((acc, val) => acc + val);

        let slideWatchers = slideCheckpoints.map(
          checkpoints => new SlideWatcher(checkpoints)
        ) as [SlideWatcher, SlideWatcher, SlideWatcher, SlideWatcher];

        let [name, difficulty] = d.name.split(".");

        this.musics[suffix][difficulty as Difficulty][name] = {
          wavFile: Path.resolve(`./private-assets/wav/${name}.wav`),
          //wavFile: `${ROOT}/../thanks/${name}.wav`,
          score: score,
          scoreLimit: maxNormalScore + maxSlideScore,
          watchers: {
            laneWatchers: laneWatchers,
            slideWatchers: slideWatchers
          }
        };
      }
    });
  }

  private loadSlideCheckpoints(
    slideNotes: SlideNote[]
  ): [
    SlideCheckpoint[],
    SlideCheckpoint[],
    SlideCheckpoint[],
    SlideCheckpoint[]
  ] {
    let result = [[], [], [], []] as [
      SlideCheckpoint[],
      SlideCheckpoint[],
      SlideCheckpoint[],
      SlideCheckpoint[]
    ];
    let currentNoteEnd = [-1, -1, -1, -1];
    slideNotes.forEach(note => {
      for (let i = 0; i < 4; ++i) {
        if (note.startExpires > currentNoteEnd[i]) {
          this.splitSlideNote(note).forEach(cp => result[i].push(cp));
          currentNoteEnd[i] = note.endExpires;
          break;
        }
      }
    });
    return result;
  }

  private splitSlideNote(note: SlideNote): SlideCheckpoint[] {
    let result = [];
    for (let t = note.startExpires; t <= note.endExpires; t += slide.delta) {
      result.push({
        noteId: note.id,
        expires: t,
        lane:
          note.startLane +
          (note.endLane - note.startLane) *
            ((t - note.startExpires) / (note.endExpires - note.startExpires)),
        point:
          point.perfect * (slide.delta / (note.endExpires - note.startExpires))
      });
    }
    return result;
  }

  get(song: string, foot: boolean, difficulty?: Difficulty): Music {
    console.log(`ms::get ${foot}`);
    let d = difficulty || "normal";
    return this.musics[foot ? "foot" : "plain"][d][song];
  }
}
