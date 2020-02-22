import { System } from '../system';
import { OtogeModel } from './model';
import * as Path from 'path';
import { OtogeSendable } from './commands/send';
import { otogeReceivable } from './commands/receive';


const system = new System<OtogeModel, OtogeSendable>(new OtogeModel(Path.resolve('./assets/songs')));

system.receive(otogeReceivable);

system.up(8080);
