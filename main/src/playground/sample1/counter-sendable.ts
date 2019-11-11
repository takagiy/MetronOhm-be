type CounterSendable =
  { command: 'incremented', count: number } |
  { command: 'reset' }

export default CounterSendable;
