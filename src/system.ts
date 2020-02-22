import express from "express";
import expressWs from "express-ws";
import * as util from "util";

import { ReceivableMap, ReceivableCommands } from "./receivable";
import { SendableMap, CommandEmitter } from "./sendable";

export class System<Model, Sendable extends SendableMap> {
  private server: expressWs.Application;

  private commandEmitter: CommandEmitter<Sendable>;

  private model: Model;

  constructor(model: Model) {
    this.model = model;
    this.server = expressWs(express()).app;
    this.commandEmitter = new CommandEmitter<Sendable>();
  }

  up(port: number) {
    this.server.listen(port, () => {
      console.log(`Server is up on http://localhost:${port}`);
    });
  }

  receive(receivable: ReceivableMap) {
    Object.keys(receivable).forEach(route => {
      this.receiveOn(route, receivable[route]);
    });
  }

  private receiveOn(route: string, receivable: ReceivableCommands) {
    this.server.ws(route, ws => {
      console.log(`${route}\t<new connection>`);

      this.commandEmitter.registerWs(route, ws);

      ws.on("close", () => {
        console.log(`${route}\t<close connection>`);
        this.commandEmitter.removeWs(route, ws);
      });

      ws.on("message", (data: string) => {
        console.log(`${route}\t-> ${util.inspect(data)}`);
        let cmd = JSON.parse(data);
        receivable[cmd.command] &&
          receivable[cmd.command](cmd, this.model, this.commandEmitter);
      });
    });
  }
}
