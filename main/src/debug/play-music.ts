import Ws from "ws";
import Path from "path";
import { exec } from "child_process";
import { argv } from "process";

import { Watcher } from "./watcher";

let music = argv[2];

let wavFile = Path.resolve(`./private-assets/wav/${music}.wav`);

let result = new Watcher("/result", cmd => {});

let selectMusic = new Watcher("/select-music", cmd => {
  if (cmd.command == "start") {
    setTimeout(() => {
      console.log(wavFile);
      exec(`aplay ${wavFile}`);
    }, cmd.time + 5000 - Date.now());
  }
});

result.ws.on("open", () => {
  result.ws.send(JSON.stringify({ command: "exit" }));
});
selectMusic.ws.on("open", () => {
  selectMusic.ws.send(
    JSON.stringify({ command: "selectMusic", name: music, difficulty: "hard" })
  );
});
