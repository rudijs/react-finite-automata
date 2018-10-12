// import { Machine } from "xstate";
const Machine = require('xstate').Machine

const toggleMachine = Machine({
  initial: "inactive",
  states: {
    inactive: { on: { TOGGLE: "active" } },
    active: { on: { TOGGLE: "inactive" } }
  }
});

// Interpret the machine however you want.
// Here's a simple (side-effectful) example:
let currentState = toggleMachine.initialState;

function send(event) {
  console.log('current', currentState.value);
  currentState = toggleMachine.transition(currentState, event);
  console.log('next', currentState.value);
}

send("TOGGLE"); // 'active'
send("TOGGLE"); // 'inactive'
