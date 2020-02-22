import { System } from "../system";
import { OtogeModel } from "./model";
import * as Path from "path";
import { OtogeSendable } from "./commands/send";
import { otogeReceivable } from "./commands/receive";

const title = String.raw`
 __  __  ____  ____  ____  _____  _  _   _____
(  \/  )( ___)(_  _)(  _ \(  _  )( \( ) (  _  )
 )    (  )__)   )(   )   / )(_)(  )  (  \ (_) /
(_/\/\_)(____) (__) (_)\_)(_____)(_)\_)(___\___)
`.slice(1, -1);

console.log(title);

const system = new System<OtogeModel, OtogeSendable>(
  new OtogeModel(Path.resolve("./assets/songs"))
);

system.receive(otogeReceivable);

system.up(8080);
