import * as fs from "fs";
import { exec } from "child_process";
import { argv } from "process";
import { Score } from "../otoge/score";

const startTime = Date.now();

const score: Score = JSON.parse(fs.readFileSync(`./assets/songs/${argv[2]}.${argv[3]}.json`, "utf-8"));

const song = `aplay ./private-assets/wav/${argv[2]}.wav`;

const clap = `aplay ./clap.wav`;

setInterval(() => {
  console.log("");
}, 100);

setTimeout(() => {
  console.log(Date.now() - startTime);
  exec(song);
}, startTime + 5000 + parseInt(argv[4]) - Date.now());

score.notes.forEach(lane =>
  lane.forEach(note => {
    setTimeout(() => {
      console.log(Date.now() - startTime);
      exec(clap);
    }, startTime + note.expires - Date.now());
  })
);
