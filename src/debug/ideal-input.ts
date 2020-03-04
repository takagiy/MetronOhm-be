import Ws from "ws";
import Path from "path";
import { exec } from "child_process";

import { Watcher } from "./watcher";
import { MusicStore } from "../otoge/music-store";

let m = "Bad_Apple";

let store = new MusicStore(Path.resolve("./assets/songs"));

let startTime: number;

let input = new Watcher("/input", cmd => {});

let notes = new Watcher("/notes", cmd => {
  if (cmd.command == "new") {
    setTimeout(() => {
      exec("aplay ./clap.wav");
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
