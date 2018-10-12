const machine = {
  green: { TIMER: "yellow" },
  yellow: { TIMER: "red" },
  red: { TIMER: "green" }
};
let state = "red";

function transition(currentState, action) {
  return machine[currentState][action];
}
console.log(101, state)
state = transition(state, "TIMER")
console.log(201, state)
state = transition(state, "TIMER")
console.log(301, state)
state = transition(state, "TIMER")
console.log(401, state)
