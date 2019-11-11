import { CommandEmitter, SendableMap } from './sendable';


export interface ReceivableCommands {
   [key: string]: (arg: object, model: unknown, emitter: CommandEmitter<SendableMap>) => void;
}

export interface ReceivableMap {
  [key: string]: ReceivableCommands;
}
