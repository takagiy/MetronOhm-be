import { ReceivableMap } from "../../receivable";

import { Difficulty } from "../difficulty";
import { OtogeModel } from "../model";
import { Sender } from "./send";
import { Play } from "../play";

export const otogeReceivable: ReceivableMap = {
  "/foot": {},
  "/notes": {},
  "/result": {
    exit(arg: {}, model: OtogeModel, sender: Sender) {
      model.nowPlaying = null;
      model.setState("selectMusic");
    }
  },
  "/select-music": {
    selectMusic(
      arg: { name: string; difficulty?: Difficulty; foot: boolean },
      model: OtogeModel,
      sender: Sender
    ) {
      console.log(`selectMusic::receive ${arg.foot}`);
      model.nowPlaying = new Play(
        model.musicStore.get(arg.name, arg.foot, arg.difficulty),
        sender,
        () => {
          model.setState("title/result");
        }
      );
      model.setState("playing");
    }
  },
  "/input": {
    lrf(arg: { xs: [number, number] }, model: OtogeModel, sender: Sender) {
      let arrivalTime = Date.now();

      if (model.state == "playing" && model.nowPlaying) {
        sender.send("/foot", {
          command: "foot",
          positionLeft: arg.xs[0] - 2,
          positionRight: arg.xs[1] - 2
        });
        model.nowPlaying.judgeSlide(arg.xs, arrivalTime, sender);
      }
    },

    button(arg: { lane: number }, model: OtogeModel, sender: Sender) {
      let arrivalTime = Date.now();

      if (model.state == "selectMusic") {
        sender.send("/select-music", { command: "button", lane: arg.lane });
      } else if (model.state == "playing" && model.nowPlaying) {
        model.nowPlaying.judge(arg.lane, arrivalTime, sender);
      } else if (model.state == "title/result") {
        sender.send("/result", { command: "button" });
      }
    }
  }
};
