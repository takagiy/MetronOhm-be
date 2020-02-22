import counterReceivable from "./counter-receivable";
import echoReceivable from "./echo-receivable";

const receivable = {
  "/counter": counterReceivable,
  "/echo": echoReceivable
};

export default receivable;
