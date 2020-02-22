import { System } from "../../system";

import Model from "./model";
import Sendable from "./sendable";
import receivable from "./receivable";

const system = new System<Model, Sendable>(new Model());

system.receive(receivable);

system.up(8080);
