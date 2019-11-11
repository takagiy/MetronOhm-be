import { Watcher } from './watcher';

let up: boolean;

let input = new Watcher('/input', cmd => {
  if(cmd.command == 'LRFUp') {
    up = true;
    lrf();
  }
  if(cmd.command == 'LRFDown') {
    up = false;
  }
});

function lrf(): void {
  if(!up) {
    return;
  }
  input.ws.send(JSON.stringify({command: 'lrf', xs: [1.5, 2.5]}));
  setTimeout(() => lrf(), 30);
}

