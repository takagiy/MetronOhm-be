import { Sender } from './sendable';
import Model from './model';


const echoReceivable = {
  echo(arg: { data: string }, _: Model, sender: Sender) {
    sender.send('/echo', { command: 'echoBack', data: arg.data });
  }
}

export default echoReceivable;
