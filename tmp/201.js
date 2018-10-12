const machine = {
  start: {
    SEARCH: "loading"
  },
  loading: {
    SEARCH_SUCCESS: "gallery",
    SEARCH_FAILURE: "error",
    CANCEL_SEARCH: "gallery"
  },
  error: {
    SEARCH: "loading"
  },
  gallery: {
    SEARCH: "loading",
    SELECT_PHOTO: "photo"
  },
  photo: {
    EXIT_PHOTO: "gallery"
  }
};

let state = "start";

function transition(currentState, action) {
  console.log(currentState, "=>", action);
  return machine[currentState][action];
}
console.log("state", state);

state = transition(state, "SEARCH");
console.log("state", state);

state = transition(state, "SEARCH_SUCCESS");
console.log("state", state);

state = transition(state, "SELECT_PHOTO");
console.log("state", state);

state = transition(state, "EXIT_PHOTO");
console.log("state", state);
