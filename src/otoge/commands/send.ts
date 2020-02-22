import { SendableMap, CommandEmitter } from "../../sendable";

import { Judge } from "../judge";
import { Rank } from "../rank";

export interface OtogeSendable extends SendableMap {
  "/notes":
    | {
        command: "new";
        id: number;
        lane: number;
        speed: number;
        time: number;
      }
    | {
        command: "newFoot";
        id: number;
        startLane: number;
        endLane: number;
        length: number;
        speed: number;
        time: number;
      }
    | {
        command: "judge";
        id: number;
        judge: Judge;
        delete: boolean;
        score: number;
        combo: number;
        comboMax: number;
        position?: number;
      }
    | {
        command: "end";
        perfectCount: number;
        greatCount: number;
        goodCount: number;
        badCount: number;
        maxCombo: number;
        score: number;
        rank: Rank;
      };
  "/foot": {
    command: "foot";
    positionLeft: number;
    positionRight: number;
  };
  "/select-music":
    | {
        command: "button";
        lane: number;
      }
    | {
        command: "start";
        time: number;
      };
  "/result": {
    command: "button";
  };
  "/input":
    | {
        command: "LRFUp";
      }
    | {
        command: "LRFDown";
      };
}

export type Sender = CommandEmitter<OtogeSendable>;
