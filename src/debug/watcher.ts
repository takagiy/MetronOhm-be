import Ws from "ws";

import { OtogeSendable } from "../otoge/commands/send";

export class Watcher<Route extends keyof OtogeSendable> {
  ws: Ws;
  receivers: ((cmd: OtogeSendable[Route], ws: Ws) => void)[];

  constructor(
    route: Route,
    ...receivers: ((cmd: OtogeSendable[Route], ws: Ws) => void)[]
  ) {
    this.receivers = receivers;
    this.ws = new Ws(`ws://localhost:8080${route}`);

    this.ws.on("message", (data: string) => {
      let cmd = JSON.parse(data) as OtogeSendable[Route];
      receivers.forEach(rcv => rcv(cmd, this.ws));
    });
  }
}
