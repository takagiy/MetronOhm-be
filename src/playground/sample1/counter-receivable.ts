import { Sender } from "./sendable";
import Model from "./model";

const counterReceivable = {
  increment(arg: { delta: number }, model: Model, sender: Sender) {
    model.count += arg.delta;
    sender.send("/counter", { command: "incremented", count: model.count });
  },
  reset(_: {}, model: Model, sender: Sender) {
    model.count = 0;
    sender.send("/counter", { command: "reset" });
  }
};

export default counterReceivable;
