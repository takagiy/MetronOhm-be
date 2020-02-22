import Ws from "ws";
import root from "app-root-path";

import { Watcher } from "./watcher";
import { MusicStore } from "../otoge/music-store";

let m = "Bad_Apple";

let store = new MusicStore(`${root}/assets/songs`);

let startTime: number;

let input = new Watcher("/input", cmd => {});

let notes = new Watcher("/notes", cmd => {
  if (cmd.command == "new") {
    setTimeout(() => {
      input.ws.send(JSON.stringify({ command: "button", lane: cmd.lane }));
    }, startTime + cmd.time - Date.now());
  }
});

let selectMusic = new Watcher("/select-music", cmd => {
  if (cmd.command == "start") {
    startTime = cmd.time;
  }
});

let foot = new Watcher("/foot", cmd => {});

let result = new Watcher("/result", cmd => {});
