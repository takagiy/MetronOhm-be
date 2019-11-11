import { CommandEmitter } from '../../sendable';

import CounterSendable from './counter-sendable';
import EchoSendable from './echo-sendable';


type Sendable = {
  '/counter': CounterSendable,
  '/echo': EchoSendable
};

export type Sender = CommandEmitter<Sendable>;

export default Sendable;
