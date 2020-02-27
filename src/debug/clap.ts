import * as fs from "fs";
import { exec } from "child_process";
import { argv, exit } from "process";
import { Score } from "../otoge/score";

let startTime = Date.now();

fs.readFile(`./assets/songs/${argv[2]}.${argv[3]}.json`, (err, data) => {
  if (err) {
    console.log(err);
    exit(1);
  }
  let score: Score = JSON.parse(data.toString());
  score.notes.forEach(lane =>
    lane.forEach(note => {
      setTimeout(() => {
        exec(`aplay ./clap.wav`);
      }, startTime + note.expires - Date.now() + (+argv[4]));
    })
  );
});

setTimeout(() => {
  exec(`aplay ./private-assets/wav/${argv[2]}.wav`);
}, startTime + 5000 - Date.now());
