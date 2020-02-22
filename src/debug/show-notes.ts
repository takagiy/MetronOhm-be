import Ws from "ws";
import Path from "path";

import { Watcher } from "./watcher";
import { MusicStore } from "../otoge/music-store";

let m = "Bad_Apple";

let store = new MusicStore(Path.resolve("./assets/songs"));

let startTime: number;

let shown = [false, false, false, false];
let preshown0 = [false, false, false, false];
let preshown1 = [false, false, false, false];

let input = new Watcher("/input", cmd => {});

let notes = new Watcher("/notes", cmd => {
  if (cmd.command == "new") {
    setTimeout(() => {
      shown[cmd.lane] = true;
    }, startTime + cmd.time - Date.now());
    setTimeout(() => {
      preshown0[cmd.lane] = true;
    }, startTime + cmd.time - Date.now() - 100);
    setTimeout(() => {
      preshown1[cmd.lane] = true;
    }, startTime + cmd.time - Date.now() - 200);
  }
});

let selectMusic = new Watcher("/select-music", cmd => {
  if (cmd.command == "start") {
    startTime = cmd.time;
  }
});

let foot = new Watcher("/foot", cmd => {});

let result = new Watcher("/result", cmd => {});

function loop() {
  let note =
    shown.reduce(
      (acc, val) => acc + "|" + (val ? "============" : "            "),
      ""
    ) + "|";
  let prenote0 =
    preshown0.reduce(
      (acc, val) => acc + " " + (val ? "------------" : "            "),
      ""
    ) + " ";
  let prenote1 =
    preshown1.reduce(
      (acc, val) => acc + " " + (val ? "------------" : "            "),
      ""
    ) + " ";
  console.log(`\u001b[10;0H${prenote1}`);
  console.log(`${prenote0}`);
  console.log(`${note}`);
  shown = [false, false, false, false];
  preshown0 = [false, false, false, false];
  preshown1 = [false, false, false, false];
  setTimeout(loop, 100);
}

loop();
