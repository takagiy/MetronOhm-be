import WebSocket from 'ws';
import * as util from 'util';


export interface SendableCommands {
  command: string;
}

export interface SendableMap {
  [key: string]: SendableCommands;
}

export class CommandEmitter<MsgMap extends SendableMap> {
  private wsMap: { [key: string]: WebSocket[] };

  constructor() {
    this.wsMap = {};
  }

  registerWs(route: keyof MsgMap, ws: WebSocket) {
    this.ensureRouteWs(route)
    this.wsMap[route as string].push(ws);
  }

  removeWs(route: keyof MsgMap, ws: WebSocket) {
    this.ensureRouteWs(route);
    this.wsMap[route as string] = this.wsMap[route as string].filter((it) => it !== ws);
  }

  send<Dest extends keyof MsgMap>(destRoute: Dest, command: MsgMap[Dest], callbackfn?: () => void) {
    this.ensureRouteWs(destRoute);
    this.wsMap[destRoute as string].forEach((ws) => {
      setImmediate(() => {
	let cmd = JSON.stringify(command);
	console.log(`${destRoute}\t<- ${util.inspect(cmd)}`);
	ws.send(cmd, callbackfn);
      });
    });
  }

  private ensureRouteWs(route: keyof MsgMap) {
    if(this.wsMap[route as string] == null) {
      this.wsMap[route as string] = [];
    }
  }
}
