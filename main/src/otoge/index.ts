import { System } from '../system';
import { OtogeModel } from './model';
import root from 'app-root-path';
import { OtogeSendable } from './commands/send';
import { otogeReceivable } from './commands/receive';


const system = new System<OtogeModel, OtogeSendable>(new OtogeModel(`${root}/assets/songs`));

system.receive(otogeReceivable);

system.up(8080);
